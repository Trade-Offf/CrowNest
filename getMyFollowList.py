import argparse
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By


def get_my_following(url):
    # 设置WebDriver路径
    webdriver_service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=webdriver_service)

    driver.get(url)

    # 滚动页面直到没有新的用户加载
    last_height = driver.execute_script("return document.body.scrollHeight")
    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)  # 等待新的用户加载
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:  # 如果没有新的用户加载，停止滚动
            break
        last_height = new_height

    following_users = driver.find_elements(By.CSS_SELECTOR, "ul.tag-list a.username")
    following_list = [user.text for user in following_users]

    driver.quit()

    return following_list


def save_following_to_file(following_list, filename):
    with open(filename, "w") as f:
        for user in following_list:
            f.write(user + "\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Get the list of users you are following on Juejin."
    )
    parser.add_argument("url", help="The URL of your following list on Juejin.")
    args = parser.parse_args()

    following_list = get_my_following(args.url)
    length = len(following_list)
    print("关注用户数:", length)

    # 保存关注的用户到文件
    save_following_to_file(following_list, "following.txt")
