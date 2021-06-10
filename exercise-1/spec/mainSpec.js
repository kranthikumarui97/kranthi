var module = require('../src/scripts/main.js');

describe('getData', function () {
	describe('when getData function is called', function () {
		it('should return user data', function () {
			var dummyElement = document.createElement('div');
      document.getElementById = jasmine.createSpy('HTML Element').andReturn(dummyElement);
      expect(document.getElementById).toHaveBeenCalledWith('...')
		});
	});
});
