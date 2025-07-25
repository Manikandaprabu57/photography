import qrcode

url = "https://manikandaprabu57.github.io/photography/"
qr = qrcode.make(url)
qr.save("my_qr_code.png")
