import requests
from bs4 import BeautifulSoup


def get_followers(url):
    session = requests.Session()
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


url = "https://juejin.cn/user/18064101621133"  # 请替换为你关注的作者的页面URL
following_str, followers_str = get_followers(url)
print(f"关注了: {following_str}")
print(f"关注者: {followers_str}")
