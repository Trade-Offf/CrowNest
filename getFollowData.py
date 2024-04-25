import requests
from bs4 import BeautifulSoup

session = requests.Session()


# 获取关注和关注者数量
def get_followers(url):
    response = session.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    follow_items = soup.find_all("a", {"class": "follow-item"})
    following = []
    followers = []
    for follow_item_index, follow_item in enumerate(follow_items):
        item_count = int(
            follow_item.find("div", {"class": "item-count"}).get_text().strip()
        )
        if follow_item_index % 2 == 0:
            following.append(item_count)
        else:
            followers.append(item_count)
    following_str = ", ".join(map(str, following))
    followers_str = ", ".join(map(str, followers))
    return following_str, followers_str


# 获取基础数据
def get_baseData(url):
    response = session.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    baseBlock = soup.find("div", {"class": "block-body"})
    counts = baseBlock.find_all("span", {"class": "count"})
    data = {}
    if len(counts) >= 3:
        data["likes"] = counts[0].get_text().strip()
        data["reads"] = counts[1].get_text().strip()
        data["jueli"] = counts[2].get_text().strip()

    return data


url = "https://juejin.cn/user/1591748568038823"  # 请替换为你关注的作者的页面 URL

following_str, followers_str = get_followers(url)
print(f"following: {following_str}")
print(f"followers: {followers_str}")

baseData = get_baseData(url)
print(baseData)
