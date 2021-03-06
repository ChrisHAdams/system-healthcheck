'use strict';

let expect = require('chai').expect;
let DateAndTime = require('../dateAndTimeFunctions');

describe('#reverseDate', function() {

  it('should return reverse date as YYYYMMDD', function() {
    const expectedResult = '20110411';
    const date = new Date('2011-04-11T10:20:30Z');

    var result = DateAndTime.getReverseDate(date);
    expect(result).to.equal(expectedResult);
  });

  it('should return "1971-10-16T22:00:00Z" as "19711016"', function() {
    const expectedResult = '19711016';
    const date = new Date('1971-10-16T22:00:00Z');

    var result = DateAndTime.getReverseDate(date);
    expect(result).to.equal(expectedResult);
  });
});

describe('#getDateAndTime', function() {

  it('should return date and time as "dd\\mm\\yyyy : hh:mm:ss"', function() {
    const expectedResult = '11\\04\\2011 : 11:20:30';
    const date = new Date('2011-04-11T10:20:30Z');

    var result = DateAndTime.getDateAndTime(date);
    expect(result).to.equal(expectedResult);
  });

  it('should return "1971-10-16T22:00:00Z" as "19711016"', function() {
    const expectedResult = '16\\10\\1971 : 22:00:00';
    const date = new Date('1971-10-16T22:00:00Z');

    var result = DateAndTime.getDateAndTime(date);
    expect(result).to.equal(expectedResult);
  });

});

describe('#getDate', function() {

  it('should return date as "dd\\mm\\yyyy"', function() {
    const expectedResult = '11\\04\\2011';
    const date = new Date('2011-04-11');

    var result = DateAndTime.getDate(date);
    expect(result).to.equal(expectedResult);
  });

});

describe('#getTime', function(){

  it('should return time as hh:mm:ss', function() {
    const expectedResult = '04:04:11';
    const date = new Date('1971-10-16T04:04:11Z');

    var result = DateAndTime.getTime(date);
    expect(result).to.equal(expectedResult);
  });
});
