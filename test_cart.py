from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

options = webdriver.ChromeOptions()
options.add_argument('--headless=new')
options.add_argument('--disable-gpu')

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

driver.get('http://localhost:8000/products.html')

# wait for page to load products
time.sleep(2)

# execute script to log cart from localStorage before clicking
cart_before = driver.execute_script("return localStorage.getItem('cart');")
print('cart before', cart_before)

# click first add to cart button
add_buttons = driver.find_elements(By.CLASS_NAME, 'add-to-cart-btn')
print('found buttons', len(add_buttons))
if add_buttons:
    add_buttons[0].click()
    time.sleep(1)

cart_after = driver.execute_script("return localStorage.getItem('cart');")
print('cart after', cart_after)

driver.quit()
