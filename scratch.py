import urllib.request

def check_headers():
    url = 'https://full-stack-ccd7.onrender.com/health'
    try:
        req = urllib.request.Request(url, method='GET')
        with urllib.request.urlopen(req) as resp:
            print("Headers:")
            for k, v in resp.headers.items():
                print(f"{k}: {v}")
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    check_headers()
