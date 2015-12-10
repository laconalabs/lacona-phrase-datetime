/** @jsx createElement */
import _ from 'lodash'
import { createElement, Phrase } from 'lacona-phrase'
import { Time } from './time'
import { DateWithTimeOfDay, DatePhrase } from './date'

export class DateTime extends Phrase {
  getValue(result) {
    if (!result) return

    if (result.date) {
      if (result.time) {
        return new Date(result.date.getFullYear(), result.date.getMonth(), result.date.getDate(), result.time.getHours(), result.time.getMinutes(), result.time.getSeconds(), 0)
      }

      if (result.impliedTime) {
        return new Date(result.date.getFullYear(), result.date.getMonth(), result.date.getDate(), result.impliedTime.default, 0, 0, 0)
      }

      return new Date(result.date.getFullYear(), result.date.getMonth(), result.date.getDate(), 8, 0, 0, 0)
    } else if (result.time) {
      const date = new Date()
      date.setHours(result.time.getHours(), result.time.getMinutes(), result.time.getSeconds(), 0)
    }
  }

  filter(result) {
    if (result && result.time && result.impliedTime) {
      return _.inRange(result.time.getHours(), ...result.impliedTime.range)
    }
    return true
  }

  describe() {
    return (
    <placeholder text='date and time'>
        <choice>
          {this.props.impliedDate ? <Time id='time' /> : null}
          {this.props.impliedTime ? [
            <DatePhrase id='date' />,
            <DateWithTimeOfDay merge={true} />
          ] : null}
          <sequence>
            <Time id='time' seconds={this.props.seconds} relative={false} recurse={false} prepositions={this.props.prepositions} />
            <literal text=' ' />
            <choice merge={true}>
              <DatePhrase id='date' recurse={false} prepositions={true} />
              <DateWithTimeOfDay />
            </choice>
          </sequence>
          <sequence>
            <choice merge={true}>
              <DatePhrase id='date' recurse={false} prepositions={this.props.prepositions} />
              <DateWithTimeOfDay />
            </choice>
            <literal text=' ' />
            <Time id='time' seconds={this.props.seconds} relative={false} recurse={false} prepositions={true} />
          </sequence>
        </choice>
      </placeholder>
    )
  }
}

DateTime.defaultProps = {
  seconds: true,
  prepositions: false,
  impliedTime: true,
  impliedDate: true
}
