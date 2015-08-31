'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should show the home view when the location is /', function() {
    browser.get('/');
    expect(element.all(by.css('h2')).first().getText()).
        toMatch(/Welcome to the home page/);
  });


  describe('login', function() {

    beforeEach(function() {
      browser.get('#/login');
    });


    it('should render login when user navigates to /login', function() {
      expect(element.all(by.css('h3')).first().getText()).
        toMatch(/Login/);
    });

    it('Should show an error message when the login fails', function() {
        // TBD
        expect(element.all(by.css('h3')).first().getText()).
        toMatch(/Login/);
    });

    it('Should redirect the user when the login is successful and then logout', function() {
        var uname = element(by.model('user.username'));
        var upw = element(by.model('user.password'));

        uname.sendKeys('john');
        upw.sendKeys('password');
        element(by.css('button')).click();
        expect(browser.getLocationAbsUrl()).toMatch("/admin");
        
        // Logout
        element(by.css('#logout')).click();
        expect(browser.getLocationAbsUrl()).toMatch("/");
    });

  });

});
