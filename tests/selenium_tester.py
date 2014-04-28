#!/usr/bin/env python
'''
Selenium framework to execute tracker tests

'''

import unittest
from sys import *
import os
 
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import NoSuchElementException, TimeoutException
#from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import time

class QUnitTests(unittest.TestCase):
    driver = None
    waiter = None
    failed = False
 
    @classmethod
    def tearDownClass(cls):
        if not cls.failed:
            cls.driver.quit()
 
    @classmethod
    def setUpClass(cls):
        #chromedriver =  "%s/chromedriver" %os.getcwd()
        #os.environ["webdriver.chrome.driver"] = chromedriver 
        #cls.driver = webdriver.Chrome(chromedriver)
        #driver = webdriver.Remote(
        #           command_executor='http://127.0.0.1:9515',
        #              desired_capabilities=DesiredCapabilities.CHROME)

    
        #from splinter import Browser
        #browser = Browser('chrome')
        #cls.driver = browser 

        #cls.driver = webdriver.Chrome()
        cls.driver = webdriver.Firefox()
        cls.waiter = WebDriverWait(cls.driver, 60)
 
    def get_el(self, selector):
        return QUnitTests.driver.find_element_by_css_selector(selector)
 
    def is_el_present(self, selector):
        try:
            QUnitTests.driver.find_element_by_css_selector(selector)
            return True
        except NoSuchElementException:
            return False
            
    def wait_for_el(self, selector):
        try:
            QUnitTests.waiter.until(lambda driver: self.is_el_present(selector))
        except TimeoutException:
            raise Exception('Never saw element %s' % (selector))
        except Exception, e:
            print "-- ", e

    def run_qunit(self, filename):
        #QUnitTests.driver.get('file:///%s/%s' % (os.getcwd(), filename))
        QUnitTests.driver.get('http://localhost/trackerv2/tests/%s' % (filename))
        self.wait_for_el('#qunit-testresult')
        #Wait for el seems broken, hence try polling for the element !
        failed_el = None 
        for i in range(10):
            try:
                failed_el = self.get_el('#qunit-testresult .failed')
                break
            except NoSuchElementException:
                time.sleep(1)

        if failed_el is None or failed_el.text != '0':
            QUnitTests.failed = True
            raise Exception('Found failures in QUnit tests in %s' % filename) 
 
    def test_models(self):
        tests = ["1.html", "carousel_test.html", "carousel_test2.html" ,"dropdown.html"]

        for test in tests:
            self.run_qunit(test)


if __name__ == "__main__":
    unittest.main()
