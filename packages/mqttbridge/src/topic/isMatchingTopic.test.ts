import { isMatchingTopic } from './isMatchingTopic.impl.js'

describe('isMatchingTopic', () => {
	it('matches on empty strings', () => {
		const input = ''
		const pattern = ''
		expect(isMatchingTopic(input, pattern)).toBeTruthy()
	})

	it('matches on exact match', () => {
		const input =
			'purista/message_type/instance_id/sender_name/sender_version/sender_target/eventname/receiver_name/receiver_version/receiver_target'
		const pattern =
			'purista/message_type/instance_id/sender_name/sender_version/sender_target/eventname/receiver_name/receiver_version/receiver_target'
		expect(isMatchingTopic(input, pattern)).toBeTruthy()
	})

	it('matches with + placeholder', () => {
		const input =
			'purista/message_type/instance_id/sender_name/sender_version/sender_target/eventname/receiver_name/receiver_version/receiver_target'
		const pattern = 'purista/message_type/+/+/+/+/+/receiver_name/receiver_version/receiver_target'
		expect(isMatchingTopic(input, pattern)).toBeTruthy()
	})

	it('matches with # placeholder', () => {
		const input =
			'purista/message_type/instance_id/sender_name/sender_version/sender_target/eventname/receiver_name/receiver_version/receiver_target'
		const pattern = 'purista/message_type/#'
		expect(isMatchingTopic(input, pattern)).toBeTruthy()
	})

	it('does not match on differences', () => {
		const input =
			'purista/message_type/instance_id/sender_name/sender_version/sender_target/eventname/receiver_name/receiver_version/receiver_target'
		const pattern =
			'purista/message_type/instance_id/sender_name/sender_version/diff/eventname/receiver_name/receiver_version/receiver_target'
		expect(isMatchingTopic(input, pattern)).toBeFalsy()
	})

	it('does not match if the pattern is longer than the input', () => {
		const input = 'purista/message_type/instance_id/'
		const pattern =
			'purista/message_type/instance_id/sender_name/sender_version/diff/eventname/receiver_name/receiver_version/receiver_target'
		expect(isMatchingTopic(input, pattern)).toBeFalsy()
	})

	it('does not match if the pattern is shorter than the input and the pattern is not ending with #', () => {
		const input =
			'purista/message_type/instance_id/sender_version/diff/eventname/receiver_name/receiver_version/receiver_target'
		const pattern = 'purista/message_type/instance_id/sender_name/'
		expect(isMatchingTopic(input, pattern)).toBeFalsy()
	})

	it('matches if the pattern is shorter than the input and the pattern is ending with #', () => {
		const input =
			'purista/message_type/instance_id/sender_version/diff/eventname/receiver_name/receiver_version/receiver_target'
		const pattern = 'purista/message_type/instance_id/sender_name/#'
		expect(isMatchingTopic(input, pattern)).toBeFalsy()
	})
})
