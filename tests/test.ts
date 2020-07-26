import {Time} from '../src/util/time';
import { expect } from 'chai';
import 'mocha';

describe('Time tests', () => {
  it('should be able to get current date', () => {
    const result = Time.now
    expect(result).to.be.not.null;
  });
});