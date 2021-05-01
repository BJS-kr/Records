import requests
from bs4 import BeautifulSoup
res = requests.get('https://finance.naver.com/sise/')
soup = BeautifulSoup(res.content,'html.parser')
datas = soup.select('#contentarea > div.box_top_submain2 > div.rgt > ul.lst_major > li')

# print(datas)

a = ['DOWJONES', 'NASDAQ', 'HONGKONG H', 'SHANGHAI SEC', 'NIKKEI 225']

for i,item in enumerate(datas):
    print(a[i],':', item.select_one('span').get_text(), end=' ')
