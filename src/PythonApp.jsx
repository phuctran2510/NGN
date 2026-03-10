import { useState } from "react";

const C = "#4ade80";
const DARK = "#020a04";

const MODS = [
  {
    id:1, icon:"🐣", color:"#4ade80",
    title:"Python Cơ Bản",
    sub:"Nền tảng lập trình Python từ số 0",
    labs:[
      {
        num:"1.1", name:"Cài Đặt & Hello World", dur:"45 phút", diff:1,
        theory:"Python là ngôn ngữ lập trình bậc cao, thông dịch, đa năng — tạo bởi Guido van Rossum năm 1991. Cú pháp gần với ngôn ngữ tự nhiên, dễ học, mạnh mẽ từ script nhỏ đến AI/ML. Python chạy trên mọi OS và có hệ sinh thái thư viện khổng lồ (PyPI).",
        steps:["Tải Python 3.x từ python.org → chọn 'Add to PATH' khi cài Windows","Cài VS Code + Python Extension (Microsoft) — F5 để chạy","Kiểm tra: terminal gõ python --version hoặc python3 --version","Tạo file hello.py → gõ code → Ctrl+F5 để chạy","Khám phá Python Shell: gõ python → REPL mode","Cài pip upgrade: python -m pip install --upgrade pip"],
        code:`# Chương trình đầu tiên
print("Hello, World!")
print("Xin chào Python 🐍")

# print() với nhiều tham số
print("Họ tên:", "Nguyễn Văn A", "Tuổi:", 20)

# Tùy chỉnh sep và end
print("Thứ 2", "Thứ 3", "Thứ 4", sep=" | ")   # Thứ 2 | Thứ 3 | Thứ 4
print("Dòng 1", end=" ←→ ")
print("Dòng 2")                                  # Dòng 1 ←→ Dòng 2

# Kiểm tra phiên bản
import sys
print(f"Python {sys.version}")

# Comment (ghi chú) — Python bỏ qua
# Đây là comment 1 dòng
"""
Đây là comment
nhiều dòng (docstring)
"""`,
        exercises:["In ra họ tên, ngày sinh, quê quán dạng card đẹp với ký tự border","In bảng cửu chương 7 (chỉ dùng print, không vòng lặp)","In hình kim cương bằng dấu * (7 tầng)","In thông tin 3 bạn cùng lớp dạng bảng căn đều"],
        results:["Python cài đặt, chạy được .py đầu tiên","Hiểu print() với sep/end","Biết comment code","Chạy được Python Shell/REPL"],
        hints:["Windows: dùng py thay python nếu lỗi","macOS/Linux: python3","VS Code: Ctrl+` mở terminal tích hợp","print() không có arg → in dòng trống"]
      },
      {
        num:"1.2", name:"Biến & Kiểu Dữ Liệu", dur:"60 phút", diff:1,
        theory:"Python dùng dynamic typing — biến không cần khai báo kiểu, kiểu được xác định lúc gán giá trị. 5 kiểu cơ bản: int (số nguyên), float (số thực), str (chuỗi), bool (đúng/sai), NoneType (rỗng). Hàm type() trả về kiểu của biến.",
        steps:["Khai báo biến: ten = 'An', tuoi = 20","Kiểm tra kiểu: print(type(ten)) → <class 'str'>","Chuyển đổi: int('123'), float('3.14'), str(42)","Multiple assignment: a, b, c = 1, 2, 3","Swap biến: a, b = b, a — cực gọn","Kiểm tra None: x is None (không dùng ==)"],
        code:`# 5 kiểu dữ liệu cơ bản
tuoi     = 21            # int — số nguyên
chieu_cao = 1.72         # float — số thực
ten      = "Nguyễn An"   # str — chuỗi
la_sv    = True          # bool — True/False
khong_co = None          # NoneType — không có giá trị

# Kiểm tra kiểu
print(type(tuoi))        # <class 'int'>
print(type(ten))         # <class 'str'>
print(type(la_sv))       # <class 'bool'>

# Số nguyên lớn — dùng _ cho dễ đọc
dan_so_vn = 98_000_000
print(dan_so_vn)         # 98000000

# Chuyển đổi kiểu (type casting)
x = "123"
print(int(x) + 1)        # 124
print(float(x))          # 123.0
print(str(456))          # "456"
print(bool(0))           # False
print(bool("hello"))     # True

# Multiple assignment
ten, tuoi, lop = "An", 20, "CNTT22"
x = y = z = 0            # gán cùng giá trị

# Swap gọn (Python-style)
a, b = 10, 20
a, b = b, a
print(a, b)              # 20 10

# Walrus operator := (Python 3.8+)
import math
if (r := float(input("Bán kính: "))) > 0:
    print(f"Diện tích: {math.pi * r**2:.4f}")`,
        exercises:["Nhập tên, tuổi, lớp từ bàn phím → in giới thiệu bản thân","Tính và in chu vi, diện tích hình chữ nhật (nhập a, b)","Đổi nhiệt độ: Celsius ↔ Fahrenheit ↔ Kelvin","Tính chỉ số BMI = cân nặng/(chiều cao)² → xếp loại"],
        results:["Hiểu 5 kiểu dữ liệu","Dùng type() và isinstance()","Chuyển đổi kiểu thành công","Multiple assignment & swap"],
        hints:["input() luôn trả về str — phải ép kiểu","bool(0)=False, bool(1)=True, bool('')=False","None là singleton: dùng is None","1_000_000 = 1000000 (dấu _ cho dễ đọc)"]
      },
      {
        num:"1.3", name:"Toán Tử Đầy Đủ", dur:"60 phút", diff:1,
        theory:"Python hỗ trợ đầy đủ các nhóm toán tử: số học (+,-,*,/,//,%,**), so sánh (==,!=,<,>,<=,>=), logic (and, or, not), gán (=,+=,-=,...), bitwise (&,|,^,~,<<,>>). Đặc biệt Python hỗ trợ chained comparison: 0 < x < 10.",
        steps:["Toán tử số học: // chia lấy nguyên, % lấy dư, ** lũy thừa","So sánh: == so sánh giá trị, is so sánh identity","Logic: and/or short-circuit (dừng sớm)","Toán tử gán ghép: +=, -=, *=, //=, **=","Chaining: 0 < x < 10 thay vì x>0 and x<10","Bitwise: & (AND), | (OR), ^ (XOR), << (shift left)"],
        code:`a, b = 17, 5

# Số học
print(a + b)    # 22 — cộng
print(a - b)    # 12 — trừ
print(a * b)    # 85 — nhân
print(a / b)    # 3.4 — chia thực (luôn float)
print(a // b)   # 3   — chia lấy nguyên
print(a % b)    # 2   — chia lấy dư
print(a ** 3)   # 4913 — lũy thừa
print(-a // b)  # -4  (floor division)

# So sánh (trả về bool)
print(5 == 5)   # True
print(5 != 3)   # True
print([1,2] == [1,2])  # True (so sánh giá trị)
x = [1, 2]
y = x
print(x is y)   # True (cùng object)
print(x is [1,2]) # False!

# Chained comparison (Python đặc trưng!)
n = 15
print(10 < n < 20)          # True
print(1 < 2 == 2 < 3)       # True

# Logic (short-circuit)
print(True and False)   # False — dừng ở False
print(False or True)    # True
print(not True)         # False
# Thực tế:
print(0 or "default")   # "default"
print("" or [] or 42)   # 42

# Gán ghép
x = 10
x += 5     # x = 15
x **= 2    # x = 225
x //= 10   # x = 22
print(x)

# Bitwise
print(0b1010 & 0b1100)  # 8  (AND)
print(0b1010 | 0b1100)  # 14 (OR)
print(1 << 3)            # 8  (shift left = nhân 2^3)`,
        exercises:["Máy tính 4 phép toán với menu lựa chọn","Kiểm tra năm nhuận (chia hết 4, trừ 100, nhưng 400 thì chia hết)","Tính tiền sau thuế: thu nhập > 5tr trừ 10%, > 10tr trừ 20%","Dùng bitwise tạo flag permission: READ=1, WRITE=2, EXEC=4"],
        results:["Sử dụng tất cả toán tử số học","Phân biệt == và is","Hiểu short-circuit logic","Chained comparison"],
        hints:["/ luôn float: 4/2 = 2.0, dùng // để lấy int","and/or trả về giá trị, không phải True/False","a % b âm nếu a âm (khác C/Java)","Bitwise chỉ dùng với int"]
      },
      {
        num:"1.4", name:"String Toàn Diện", dur:"90 phút", diff:2,
        theory:"String là kiểu immutable (bất biến) — không thể sửa trực tiếp mà phải tạo mới. Hỗ trợ indexing âm (-1 = cuối), slicing linh hoạt [start:stop:step], và hơn 40 phương thức built-in. f-string (Python 3.6+) là cách format hiện đại nhất.",
        steps:["Tạo string: nháy đơn, đôi, triple quotes (nhiều dòng)","Indexing: s[0] đầu, s[-1] cuối","Slicing: s[1:4], s[::-1] đảo ngược","Phương thức: upper/lower, strip, split/join, replace, find","f-string: f'{name}', f'{val:.2f}', f'{val:>10}'","Kiểm tra: in, startswith, endswith, isdigit, isalpha"],
        code:`# Tạo string
s1 = "Hello Python"
s2 = 'Xin chào'
s3 = """Chuỗi
nhiều dòng"""
s4 = r"C:\Users\abc"   # raw string — \ không escape

# Indexing
ten = "PYTHON"
print(ten[0])       # P
print(ten[-1])      # N
print(ten[2])       # T

# Slicing [start:stop:step]
print(ten[1:4])     # YTH
print(ten[:3])      # PYT
print(ten[3:])      # HON
print(ten[::2])     # PTO (bước 2)
print(ten[::-1])    # NOHTYP (đảo ngược)

# Các phương thức quan trọng
s = "  Hello, Python!  "
print(s.strip())              # "Hello, Python!"
print(s.lstrip())             # "Hello, Python!  "
print(s.upper())              # "  HELLO, PYTHON!  "
print(s.lower())              # "  hello, python!  "
print(s.replace("o", "0"))    # "  Hell0, Pyth0n!  "
print(s.count("l"))           # 3

# split / join
words = "táo,chuối,cam,xoài".split(",")
print(words)                  # ['táo', 'chuối', 'cam', 'xoài']
print(" | ".join(words))      # táo | chuối | cam | xoài

# find / index
s = "Hello World"
print(s.find("World"))        # 6
print(s.find("xyz"))          # -1 (không lỗi)

# f-string — format mạnh mẽ
ten, diem, ti_le = "An", 8.75, 0.875
print(f"SV: {ten}")                  # SV: An
print(f"Điểm: {diem:.1f}")           # Điểm: 8.8
print(f"Tỉ lệ: {ti_le:.1%}")         # Tỉ lệ: 87.5%
print(f"{'Tên':<10}{'Điểm':>8}")     # căn trái/phải
print(f"{ten:<10}{diem:>8.2f}")

# Kiểm tra
print("py" in "python")         # True
print("abc".startswith("ab"))   # True
print("123".isdigit())          # True
print("Hello".isalpha())        # True
print("  \\t  ".isspace())       # True

# Escape characters
print("Dòng 1\\nDòng 2")         # xuống dòng
print("Tab\\there")              # tab
print("Nháy đơn: \\'")`,
        exercises:["Palindrome checker: 'madam', 'racecar', 'A man a plan a canal Panama'","Caesar cipher: mã hóa/giải mã dịch k ký tự","Đếm tần suất từ trong đoạn văn (case-insensitive)","Validate email: phải có @, domain hợp lệ, không có ký tự đặc biệt","Viết hàm title_case không dùng .title() (tự xử lý)"],
        results:["Indexing/slicing thành thạo","Dùng 10+ phương thức string","f-string với format spec","Hiểu string immutability"],
        hints:["s.split() không arg tách theo whitespace (nhiều dấu cách OK)","strip/lstrip/rstrip xóa whitespace mặc định","f'{val:,}' thêm dấu phẩy phân cách nghìn","' '.join(lst) nhanh hơn loop cộng string"]
      },
      {
        num:"1.5", name:"if/elif/else & Match-Case", dur:"60 phút", diff:1,
        theory:"Rẽ nhánh kiểm soát luồng thực thi. Python dùng indentation (4 spaces) thay {} để phân chia khối code. elif = else if. Python 3.10 thêm match/case (structural pattern matching) mạnh hơn switch/case nhiều ngôn ngữ khác.",
        steps:["if condition: + indentation 4 spaces","elif cho nhiều nhánh (không giới hạn số lượng)","else: trường hợp còn lại (tùy chọn)","Ternary: value_if_true if condition else value_if_false","Truthy/Falsy: 0, '', [], {}, (), None, False là falsy","match/case (3.10+): pattern matching cực mạnh"],
        code:`# if / elif / else
diem = float(input("Nhập điểm (0-10): "))

if diem >= 9.0:
    loai = "Xuất Sắc"
elif diem >= 8.0:
    loai = "Giỏi"
elif diem >= 6.5:
    loai = "Khá"
elif diem >= 5.0:
    loai = "Trung Bình"
elif diem >= 0:
    loai = "Yếu"
else:
    loai = "Điểm không hợp lệ"

print(f"Xếp loại: {loai}")

# Ternary operator (1 dòng)
n = int(input("Số: "))
kt = "Chẵn" if n % 2 == 0 else "Lẻ"
print(f"{n} là số {kt}")

# Truthy / Falsy (rất quan trọng trong Python)
# Falsy: 0, 0.0, "", [], {}, (), set(), None, False
ds = []
if not ds:
    print("Danh sách rỗng!")      # In ra

ten = ""
print(ten or "Chưa có tên")       # "Chưa có tên"

# match / case (Python 3.10+)
lenh = input("Lệnh (start/stop/status): ").lower()
match lenh:
    case "start":
        print("▶ Khởi động...")
    case "stop" | "quit" | "exit":
        print("⏹ Dừng lại")
    case "status":
        print("● Đang chạy")
    case _:
        print(f"❌ Lệnh '{lenh}' không hợp lệ")

# match với destructuring
point = (1, 0)
match point:
    case (0, 0): print("Gốc tọa độ")
    case (x, 0): print(f"Trên trục X: x={x}")
    case (0, y): print(f"Trên trục Y: y={y}")
    case (x, y): print(f"Điểm ({x}, {y})")

# nested if
x = int(input("Nhập x: "))
if x > 0:
    if x % 2 == 0:
        print("Số dương chẵn")
    else:
        print("Số dương lẻ")
elif x < 0:
    print("Số âm")
else:
    print("Số không")`,
        exercises:["Máy tính đổi tiền: VND → USD/EUR/JPY/BTC (tỷ giá nhập tay)","Game đoán số 1-100: cho biết 'cao hơn'/'thấp hơn'/'chính xác'","Xếp loại học lực kết hợp hạnh kiểm (2 input)","Giải phương trình bậc 2 ax²+bx+c=0 (xử lý tất cả trường hợp)"],
        results:["if/elif/else đúng cú pháp","Ternary operator","Hiểu truthy/falsy","match/case Python 3.10+"],
        hints:["pass: block rỗng (placeholder)","and/or trong condition ngắn hơn nested if","match so sánh structural, không chỉ giá trị","Không có switch/case trước Python 3.10"]
      },
      {
        num:"1.6", name:"Vòng Lặp for & while", dur:"90 phút", diff:2,
        theory:"Python có 2 vòng lặp: for duyệt qua iterable (list, str, range, dict...), while chạy theo điều kiện. Cả hai hỗ trợ break (thoát), continue (bỏ qua vòng), else (chạy khi loop kết thúc bình thường). enumerate() và zip() là tools cực hữu ích.",
        steps:["for i in range(n): — duyệt 0 đến n-1","range(start, stop, step): linh hoạt","for item in list/str/dict — duyệt iterable","while condition: — điều kiện","break: thoát vòng lặp ngay lập tức","continue: bỏ qua iteration hiện tại, tiếp tục","else: chạy khi vòng kết thúc bình thường (không break)"],
        code:`# for với range
for i in range(5):              # 0,1,2,3,4
    print(i, end=" ")
print()

for i in range(1, 11):          # 1→10
    print(i, end=" ")

for i in range(10, 0, -2):      # 10,8,6,4,2
    print(i, end=" ")

# for duyệt list / string
fruits = ["táo", "chuối", "cam", "xoài"]
for fruit in fruits:
    print(f"🍎 {fruit}")

for char in "Python":
    print(char, end="-")         # P-y-t-h-o-n-

# enumerate: lấy cả index và value
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")

# zip: duyệt song song 2 list
ten_list = ["An", "Bình", "Chi"]
diem_list = [8.5, 9.0, 7.5]
for ten, diem in zip(ten_list, diem_list):
    print(f"{ten}: {diem}")

# while
dem = 1
while dem <= 5:
    print(dem, end=" ")
    dem += 1

# while True + break (vòng lặp có kiểm soát)
while True:
    x = input("Nhập số (q thoát): ")
    if x == "q": break
    print(f"Bình phương: {int(x)**2}")

# break và continue
for i in range(10):
    if i == 3: continue     # bỏ qua 3
    if i == 7: break        # dừng khi 7
    print(i, end=" ")       # 0 1 2 4 5 6

# else trong vòng lặp (ít biết!)
for i in range(2, 20):
    for j in range(2, i):
        if i % j == 0:
            break
    else:
        print(f"{i} là số nguyên tố")  # chỉ in khi không break

# Nested loop — ma trận
for i in range(1, 4):
    for j in range(1, 4):
        print(f"{i*j:3}", end="")
    print()`,
        exercises:["In bảng cửu chương 2-9 dạng bảng đẹp 80 cột","FizzBuzz 1-100 (chia 3→Fizz, 5→Buzz, cả 2→FizzBuzz)","Dãy Fibonacci ≤ 10000 dùng while","Tính tổng số nguyên tố từ 1 đến n (nhập n)","In tam giác Pascal 10 hàng đầu","Game đoán số (nhiều lượt, đếm số lần đoán)"],
        results:["for/range thành thạo","enumerate và zip","while với break/continue","else trong vòng lặp"],
        hints:["range() tạo lazy sequence (tiết kiệm RAM)","for...else: else chỉ skip khi có break","while True + break = do-while pattern","zip() dừng khi list ngắn nhất hết"]
      },
      {
        num:"1.7", name:"Hàm (Functions) Đầy Đủ", dur:"90 phút", diff:2,
        theory:"Hàm là khối code có thể tái sử dụng, nhận input (tham số) và trả về output (return). Python hỗ trợ: tham số mặc định, *args (tuple các arg), **kwargs (dict keyword args), lambda, closure, decorator đơn giản, docstring và type annotation.",
        steps:["def func_name(params): + return","Tham số mặc định: def f(x, n=2) — đặt cuối","*args: nhận bất kỳ số lượng positional args","**kwargs: nhận bất kỳ số lượng keyword args","Lambda: hàm ẩn danh 1 expression","Scope: LEGB (Local→Enclosing→Global→Built-in)","Docstring: triple-quotes ngay sau def"],
        code:`# Hàm cơ bản
def chao(ten: str) -> str:
    """Trả về câu chào với tên được cung cấp."""
    return f"Xin chào, {ten}!"

print(chao("Python"))      # Xin chào, Python!
print(chao.__doc__)        # docstring

# Tham số mặc định
def luy_thua(co_so: float, mu: int = 2) -> float:
    return co_so ** mu

print(luy_thua(3))         # 9 (dùng mặc định)
print(luy_thua(2, 10))     # 1024

# *args — tuple các positional args
def tong(*so) -> float:
    return sum(so)

print(tong(1, 2, 3, 4, 5))    # 15
print(tong(*[10, 20, 30]))     # unpack list

# **kwargs — dict keyword args
def hien_thi(**info):
    for k, v in info.items():
        print(f"  {k}: {v}")

hien_thi(ten="An", tuoi=20, lop="CNTT22")

# Kết hợp tất cả
def func(a, b=10, *args, **kwargs):
    print(f"a={a}, b={b}, args={args}, kw={kwargs}")

func(1)                        # a=1, b=10
func(1, 2, 3, 4, x=5, y=6)    # đầy đủ

# Return nhiều giá trị (trả về tuple)
def thong_ke(lst):
    return min(lst), max(lst), sum(lst)/len(lst)

lo, hi, avg = thong_ke([3,1,4,1,5,9,2,6])
print(f"Min={lo} Max={hi} Avg={avg:.2f}")

# Lambda
binh_phuong = lambda x: x ** 2
print(binh_phuong(7))      # 49

# Lambda với sorted
svs = [("An", 8.5), ("Bình", 9.0), ("Chi", 7.5)]
svs.sort(key=lambda x: x[1], reverse=True)
print(svs)

# Closure
def bo_dem(start=0):
    count = [start]             # dùng list để có thể thay đổi
    def tang():
        count[0] += 1
        return count[0]
    return tang

dem = bo_dem()
print(dem(), dem(), dem())      # 1 2 3

# Đệ quy
def giai_thua(n: int) -> int:
    if n <= 1: return 1
    return n * giai_thua(n - 1)

print(giai_thua(10))           # 3628800`,
        exercises:["Đệ quy: tính số Fibonacci thứ n; so sánh với phiên bản lặp","Hàm kiểm tra số nguyên tố, dùng nó in NT từ 1-200","Decorator @timer đo thời gian chạy hàm","Closure: tạo hàm tính lãi suất (rate được đóng gói)","Hàm flatten: list lồng nhiều cấp → list phẳng"],
        results:["Viết hàm với *args, **kwargs","Lambda và sorted","Closure","Docstring + type annotation"],
        hints:["Tham số mặc định mutable (list/dict) là bug thường gặp — dùng None","*args là tuple, **kwargs là dict","return không arg → trả về None","Đệ quy cần base case để không infinite loop"]
      },
      {
        num:"1.8", name:"Exception Handling", dur:"60 phút", diff:2,
        theory:"Exception (ngoại lệ) xảy ra khi runtime gặp lỗi. Python dùng try/except/else/finally. Có thể bắt nhiều exception, tự raise, tạo custom exception kế thừa Exception. Context manager (with) tự động dọn dẹp tài nguyên.",
        steps:["try: code có thể lỗi","except ExcType as e: xử lý lỗi","else: chạy khi try KHÔNG có lỗi","finally: luôn chạy (dọn dẹp)","raise ExcType('message') — tự tạo lỗi","class MyError(Exception): — custom exception"],
        code:`# try / except / else / finally
try:
    x = int(input("Nhập số: "))
    ket_qua = 100 / x
except ValueError:
    print("❌ Không phải số nguyên!")
except ZeroDivisionError:
    print("❌ Không thể chia cho 0!")
except Exception as e:
    print(f"❌ Lỗi: {type(e).__name__}: {e}")
else:
    print(f"✅ Kết quả: {ket_qua}")   # chỉ chạy khi không lỗi
finally:
    print("🔄 Khối finally luôn chạy")

# Bắt nhiều exception cùng lúc
try:
    pass
except (ValueError, TypeError, IndexError) as e:
    print(f"Lỗi: {e}")

# raise — tự tạo exception
def chia(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("Mẫu số không được bằng 0!")
    return a / b

# Custom Exception
class DiemKhongHopLe(ValueError):
    def __init__(self, diem: float):
        self.diem = diem
        super().__init__(f"Điểm {diem} phải trong [0, 10]")

class TuoiKhongHopLe(ValueError):
    pass

def cap_nhat_diem(diem: float):
    if not 0 <= diem <= 10:
        raise DiemKhongHopLe(diem)
    return "Đã cập nhật"

# Try nhiều cấp (nested)
def doc_so_tu_file(path):
    try:
        with open(path) as f:
            return int(f.read().strip())
    except FileNotFoundError:
        print(f"File '{path}' không tồn tại")
        return None
    except ValueError:
        print("Nội dung file không phải số")
        return None

# Context manager — with statement
# Tự động gọi __exit__ dù có lỗi hay không
try:
    with open("data.txt", "r") as f:
        data = f.read()
except FileNotFoundError:
    print("File không tìm thấy")

# Logging thay vì print (production code)
import logging
logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s")
try:
    result = chia(10, 0)
except ValueError as e:
    logging.error(f"Lỗi phép tính: {e}")`,
        exercises:["Vòng lặp nhập số nguyên, thử lại đến khi hợp lệ","Đọc file an toàn: trả về None nếu không tìm thấy hoặc lỗi","Custom exception hierarchy: AppError→DatabaseError/NetworkError","Viết context manager @contextmanager đo thời gian"],
        results:["try/except/else/finally đúng","Custom exception","raise exception","Context manager with"],
        hints:["except Exception bắt tất cả — dùng cẩn thận","finally chạy kể cả khi có return trong try","Không bare except: (bắt cả KeyboardInterrupt)","raise (không arg) re-raise exception hiện tại"]
      }
    ]
  },
  {
    id:2, icon:"📦", color:"#60a5fa",
    title:"Cấu Trúc Dữ Liệu",
    sub:"List, Tuple, Dict, Set và Comprehension",
    labs:[
      {
        num:"2.1", name:"List Toàn Diện", dur:"90 phút", diff:2,
        theory:"List là cấu trúc dữ liệu linh hoạt nhất Python: có thứ tự (ordered), mutable (thay đổi được), chứa mọi kiểu. Hỗ trợ indexing âm, slicing đa dạng và 11 methods built-in. List 2D/3D dùng cho ma trận.",
        steps:["Tạo list: [], list(), list(range(n))","Truy cập: lst[0], lst[-1], lst[2:5]","Thêm: append() cuối, insert(i,v) tại i, extend() nhiều phần tử","Xóa: remove(val), del lst[i], pop(i)","Sắp xếp: sort() tại chỗ, sorted() trả list mới","Copy đúng: lst.copy() hoặc lst[:] (shallow), copy.deepcopy (deep)"],
        code:`# Tạo list
nums = [3, 1, 4, 1, 5, 9, 2, 6]
mixed = [1, "hello", 3.14, True, None, [1,2]]
empty = []
from_range = list(range(1, 11))     # [1..10]

# Truy cập & slicing
print(nums[0])       # 3
print(nums[-1])      # 6
print(nums[2:5])     # [4, 1, 5]
print(nums[::2])     # [3, 4, 5, 2] (bước 2)
print(nums[::-1])    # đảo ngược

# Thêm phần tử
nums.append(7)               # thêm cuối
nums.insert(0, 0)            # chèn đầu
nums.extend([8, 9, 10])      # nối list
nums += [11, 12]             # cũng nối

# Xóa phần tử
nums.remove(1)               # xóa giá trị 1 đầu tiên
del nums[0]                  # xóa theo index
popped = nums.pop()          # lấy và xóa cuối
popped2 = nums.pop(2)        # lấy và xóa index 2

# Tìm kiếm
print(5 in nums)             # True/False
print(nums.index(9))         # vị trí đầu tiên
print(nums.count(1))         # số lần xuất hiện

# Sắp xếp
fruits = ["chuối", "táo", "cam", "xoài", "mận"]
fruits.sort()                          # tại chỗ, alphabetical
fruits.sort(key=len)                   # theo độ dài
fruits.sort(key=lambda x: x[-1])       # theo ký tự cuối
sorted_copy = sorted(fruits, reverse=True)  # tạo list mới

# Thống kê
print(len(nums), min(nums), max(nums), sum(nums))

# Copy (cực quan trọng!)
a = [1, [2, 3], 4]
b = a            # ⚠️ KHÔNG copy — b trỏ đến a
c = a.copy()     # shallow copy
d = a[:]         # shallow copy
import copy
e = copy.deepcopy(a)   # deep copy — độc lập hoàn toàn

# List 2D (ma trận 3×3)
matrix = [[1,2,3],[4,5,6],[7,8,9]]
print(matrix[1][2])    # 6

# Tạo ma trận 0s
zero_mat = [[0]*3 for _ in range(3)]  # đúng cách!
# KHÔNG dùng: [[0]*3]*3 (cùng reference)`,
        exercises:["Quản lý danh sách SV: thêm, xóa, tìm, sắp xếp theo tên/điểm","Xóa phần tử trùng lặp giữ nguyên thứ tự (không dùng set)","Rotate list k vị trí sang phải (không dùng deque)","Merge 2 sorted list → 1 sorted list (merge step)","Tìm tất cả cặp (i,j) có nums[i]+nums[j] = target (Two Sum)"],
        results:["Thành thạo append/insert/remove/pop","sort với key function","Phân biệt shallow vs deep copy","List 2D/ma trận"],
        hints:["a.sort() in-place, sorted(a) trả list mới","list*n nhân bản: [0]*5 = [0,0,0,0,0]","enumerate() dùng khi cần cả index và value","Tránh xóa phần tử trong khi đang duyệt list"]
      },
      {
        num:"2.2", name:"Tuple & Set", dur:"60 phút", diff:2,
        theory:"Tuple: immutable, nhanh hơn list 10-20%, làm key dict được, unpacking linh hoạt. Set: unordered, unique (không trùng), O(1) lookup, hỗ trợ phép toán tập hợp (union, intersection, difference, symmetric difference).",
        steps:["Tuple: (1,2,3), t=(1,) — cần dấu phẩy với 1 phần tử","Tuple unpacking: a,b,c = t; first,*rest = t","namedtuple: tuple có tên field","Set: {1,2,3}, set() — không phải {} (dict rỗng)","Phép toán: | (union), & (inter), - (diff), ^ (sym diff)","frozenset: immutable set, làm key dict được"],
        code:`# TUPLE
t1 = (1, 2, 3)
t2 = 1, 2, 3       # dấu () không bắt buộc
t3 = (42,)         # tuple 1 phần tử — cần dấu ,
t4 = ()            # tuple rỗng

# Unpacking
x, y, z = t1
print(x, y, z)     # 1 2 3

# Extended unpacking
first, *rest = (1, 2, 3, 4, 5)
print(first)       # 1
print(rest)        # [2, 3, 4, 5]

*head, last = (1, 2, 3, 4, 5)
print(last)        # 5

a, *mid, b = (1, 2, 3, 4, 5)
print(mid)         # [2, 3, 4]

# Named tuple
from collections import namedtuple
Point = namedtuple('Point', ['x', 'y', 'z'])
SinhVien = namedtuple('SinhVien', 'ten msv diem')

p = Point(1, 2, 3)
print(p.x, p[0])   # 1 1
sv = SinhVien("An", "B001", 8.5)
print(sv.ten, sv.diem)

# Tuple là key dict (list thì không được)
neighbors = {(0,0): [(0,1),(1,0)], (0,1): [(0,0),(1,1)]}

# ────────────────────────────────
# SET
s1 = {1, 2, 3, 4, 5}
s2 = set([3, 4, 5, 6, 7])
empty_set = set()          # {} là dict!

# Thêm / xóa
s1.add(6)
s1.discard(10)             # không lỗi nếu không có
s1.remove(1)               # lỗi nếu không có

# Phép toán tập hợp
print(s1 | s2)   # {1,2,3,4,5,6,7}  union
print(s1 & s2)   # {3,4,5,6}        intersection
print(s1 - s2)   # {1,2}            difference
print(s1 ^ s2)   # {1,2,7}          symmetric diff

# In-place (thay đổi s1)
s1 |= s2         # s1 = s1 | s2
s1 &= {3,4,5}

# Kiểm tra
print({1,2}.issubset({1,2,3}))      # True
print({1,2,3}.issuperset({1,2}))    # True
print({1,2}.isdisjoint({3,4}))      # True

# Ứng dụng thực tế
# Xóa trùng lặp (thứ tự không đảm bảo)
lst = [1,2,2,3,3,3,4]
unique = list(set(lst))

# Phần tử chung của 3 list
a, b, c = [1,2,3,4], [2,3,4,5], [3,4,5,6]
common = set(a) & set(b) & set(c)
print(common)    # {3, 4}`,
        exercises:["Đếm số ký tự duy nhất trong chuỗi (không phân biệt hoa thường)","Tìm các từ xuất hiện trong cả 2 bài văn (intersection)","Dùng namedtuple tạo struct HinhChuNhat, tính DT/ChuVi","Implement Sieve of Eratosthenes với set"],
        results:["Tuple unpacking nâng cao","namedtuple","Set operations","Biết khi nào dùng set vs list"],
        hints:["Tuple nhanh hơn list khi chỉ đọc (không sửa)","frozenset: immutable, dùng làm key dict","set không có thứ tự — enumerate(set) không ổn định","discard() an toàn hơn remove()"]
      },
      {
        num:"2.3", name:"Dictionary Nâng Cao", dur:"90 phút", diff:2,
        theory:"Dictionary là cấu trúc key-value, O(1) tra cứu/thêm/xóa. Key phải hashable (immutable). Python 3.7+ dict giữ insertion order. Rất hữu ích với defaultdict (không lỗi key thiếu), Counter (đếm), và OrderedDict.",
        steps:["Tạo: {k:v}, dict(a=1), dict(zip(keys,vals))","Truy cập: d[k], d.get(k, default)","Thêm/sửa: d[k]=v, d.update({...})","Xóa: del d[k], d.pop(k), d.popitem()","Duyệt: .keys(), .values(), .items()","defaultdict, Counter, merge với | (3.9+)"],
        code:`# Tạo dict
sv = {"ten": "Nguyen An", "tuoi": 20, "diem": 8.5}
d2 = dict(ten="Le Binh", tuoi=21)
d3 = dict(zip(["a","b","c"], [1,2,3]))

# Truy cập an toàn
print(sv["ten"])                     # "Nguyen An"
print(sv.get("lop", "Chưa có"))      # "Chưa có" (key vắng)
print(sv.get("diem", 0))             # 8.5

# Thêm / sửa / xóa
sv["lop"] = "CNTT22"                 # thêm
sv["tuoi"] = 21                      # sửa
sv.update({"email": "an@dlu.edu.vn", "gpa": 3.4})

removed = sv.pop("gpa", None)        # xóa, trả về None nếu không có
sv.setdefault("hocbong", False)      # thêm nếu chưa có

# Duyệt
for k in sv:                         # duyệt keys
    print(k)
for k, v in sv.items():
    print(f"  {k}: {v}")

# Dict comprehension
squares = {x: x**2 for x in range(1, 6)}
# {1:1, 2:4, 3:9, 4:16, 5:25}

even_sq = {x: x**2 for x in range(1,11) if x%2==0}

# Đảo ngược dict
inv = {v: k for k, v in squares.items()}

# defaultdict — không lỗi KeyError
from collections import defaultdict

# Nhóm SV theo lớp
svs = [("An","CNTT"),("Binh","KT"),("Chi","CNTT")]
nhom = defaultdict(list)
for ten, lop in svs:
    nhom[lop].append(ten)
print(dict(nhom))   # {'CNTT': ['An','Chi'], 'KT': ['Binh']}

# Counter — đếm phần tử
from collections import Counter
text = "abracadabra"
cnt = Counter(text)
print(cnt)                      # Counter({'a':5,'b':2,'r':2,'c':1,'d':1})
print(cnt.most_common(3))       # 3 phổ biến nhất
print(cnt["a"])                 # 5
cnt2 = Counter("banana")
print(cnt + cnt2)               # cộng tần suất
print(cnt - cnt2)               # trừ tần suất

# Merge dicts (Python 3.9+)
d1 = {"a": 1, "b": 2}
d2 = {"b": 3, "c": 4}
merged = d1 | d2               # {"a":1, "b":3, "c":4}
d1 |= d2                       # in-place merge

# Nested dict
config = {
    "database": {"host": "localhost", "port": 5432},
    "cache":    {"host": "redis",     "port": 6379},
}
print(config["database"]["port"])   # 5432`,
        exercises:["Đếm tần suất từ đoạn văn, in 10 từ phổ biến nhất","Phone book: thêm/xóa/tìm/hiển thị, lưu/tải JSON","Nhóm số từ 1-50 theo số chữ số nguyên tố của chúng","Implement LRU Cache với OrderedDict"],
        results:["Phân biệt get() vs []","defaultdict và Counter","Dict comprehension","Merge dict Python 3.9+"],
        hints:["d.get(k) không add key, setdefault() có add","Counter kế thừa dict — có thể dùng như dict","{**d1, **d2} merge (3.5+); d1|d2 clean hơn (3.9+)","popitem() xóa và trả về cặp cuối cùng (3.7+ LIFO)"]
      },
      {
        num:"2.4", name:"Comprehension & Generator", dur:"90 phút", diff:3,
        theory:"Comprehension là cách Pythonic tạo list/dict/set ngắn gọn và nhanh hơn vòng lặp thường ~30%. Generator tạo phần tử lazily (chỉ khi cần), tiết kiệm RAM cực kỳ. yield biến hàm thành generator. itertools cung cấp công cụ iterator mạnh mẽ.",
        steps:["List comp: [expr for x in iter if cond]","Dict comp: {k:v for ...}; Set comp: {expr for ...}","Generator expr: (expr for ...) — dùng () thay []","Generator function với yield","yield from: delegate sang iterable khác","itertools: chain, product, combinations, permutations, groupby"],
        code:`# List comprehension
squares = [x**2 for x in range(10)]
evens   = [x for x in range(20) if x%2==0]
matrix  = [[i*j for j in range(1,4)] for i in range(1,4)]

# So sánh với for loop
# Traditional:
result = []
for x in range(10):
    if x % 2 == 0:
        result.append(x**2)
# Comprehension (ngắn hơn, nhanh ~30%):
result = [x**2 for x in range(10) if x%2==0]

# Nested — flatten ma trận
nested = [[1,2,3],[4,5,6],[7,8,9]]
flat = [x for row in nested for x in row]

# Dict comprehension
word_len = {w: len(w) for w in "hello world python".split()}
inv_dict = {v: k for k, v in word_len.items()}

# Set comprehension
unique_lens = {len(w) for w in "hi hello hey world".split()}

# Conditional expression trong comp
classify = ["Even" if x%2==0 else "Odd" for x in range(5)]

# ────────────────────────────────
# GENERATOR EXPRESSION
gen = (x**2 for x in range(1_000_000))  # không tốn RAM!
print(next(gen))    # 0
print(next(gen))    # 1
print(sum(x**2 for x in range(1000)))  # pass generator trực tiếp

# GENERATOR FUNCTION với yield
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

fib = fibonacci()
first10 = [next(fib) for _ in range(10)]
print(first10)   # [0,1,1,2,3,5,8,13,21,34]

# yield from
def flatten(nested):
    for item in nested:
        if isinstance(item, list):
            yield from flatten(item)   # đệ quy với yield from
        else:
            yield item

print(list(flatten([1,[2,[3,4]],[5,6]])))  # [1,2,3,4,5,6]

# ────────────────────────────────
# ITERTOOLS
import itertools

# chain: nối iterables
print(list(itertools.chain([1,2],[3,4],[5,6])))

# product: Cartesian product
print(list(itertools.product("AB", "12")))
# [('A','1'),('A','2'),('B','1'),('B','2')]

# combinations và permutations
print(list(itertools.combinations([1,2,3], 2)))
print(list(itertools.permutations([1,2,3], 2)))

# groupby
data = [("A",1),("A",2),("B",1),("B",3),("C",2)]
for k, g in itertools.groupby(data, key=lambda x: x[0]):
    print(k, list(g))

# islice — lazy slice
first5 = list(itertools.islice(fibonacci(), 5))`,
        exercises:["Dùng comp tạo bảng cửu chương dạng dict {(i,j): i*j}","Generator vô tận: số nguyên tố lazily","Flatten list lồng nhiều cấp bất kỳ","Tất cả tổ hợp 3 chữ số từ 0-9 không trùng (itertools)"],
        results:["List/dict/set comprehension","Generator với yield","yield from","itertools module"],
        hints:["List comp nhanh hơn for loop ~30%","Generator: dùng khi data lớn hoặc vô tận","next() trên generator đã hết → StopIteration","itertools.islice() lấy n phần tử đầu generator"]
      }
    ]
  },
  {
    id:3, icon:"🏛️", color:"#f472b6",
    title:"Lập Trình Hướng Đối Tượng",
    sub:"Class, Kế thừa, Đa hình, Magic Methods",
    labs:[
      {
        num:"3.1", name:"Class & Object", dur:"90 phút", diff:2,
        theory:"OOP (Object-Oriented Programming) tổ chức code thành đối tượng có trạng thái (attributes) và hành vi (methods). __init__ là constructor. self là reference đến instance hiện tại. Python hỗ trợ class attributes (dùng chung) và instance attributes (riêng từng object).",
        steps:["class ClassName: + def __init__(self, ...)","Instance attributes: self.x = val","Class attributes: khai báo ngoài __init__","@property: getter/setter với validation","@classmethod: cls, factory method","@staticmethod: không cần self/cls"],
        code:`class SinhVien:
    # Class attribute — dùng chung cho tất cả instance
    truong = "Đại học Đà Lạt"
    _so_luong = 0

    def __init__(self, ten: str, msv: str, diem: float = 0.0):
        # Instance attributes — riêng từng SV
        self.ten = ten
        self.msv = msv
        self._diem = diem          # _ convention: semi-private
        SinhVien._so_luong += 1

    # Property — getter
    @property
    def diem(self) -> float:
        return self._diem

    # Setter với validation
    @diem.setter
    def diem(self, val: float):
        if not 0 <= val <= 10:
            raise ValueError(f"Điểm {val} phải trong [0,10]")
        self._diem = val

    @property
    def xep_loai(self) -> str:
        if self._diem >= 8:   return "Giỏi"
        if self._diem >= 6.5: return "Khá"
        if self._diem >= 5:   return "Trung Bình"
        return "Yếu"

    # Instance method
    def gioi_thieu(self) -> str:
        return f"SV {self.ten} ({self.msv}) — {self.xep_loai}"

    # Class method — factory pattern
    @classmethod
    def tu_chuoi(cls, s: str) -> "SinhVien":
        """Tạo từ string 'ten|msv|diem'"""
        ten, msv, diem = s.split("|")
        return cls(ten, msv, float(diem))

    @classmethod
    def so_luong(cls) -> int:
        return cls._so_luong

    # Static method — không cần self hay cls
    @staticmethod
    def kiem_tra_msv(msv: str) -> bool:
        import re
        return bool(re.match(r'^[A-Z]\d{3}$', msv))

    # Magic methods
    def __str__(self):
        return f"SinhVien({self.ten}, {self.msv})"

    def __repr__(self):
        return f"SinhVien('{self.ten}', '{self.msv}', {self._diem})"

    def __eq__(self, other):
        return isinstance(other, SinhVien) and self.msv == other.msv

    def __lt__(self, other):
        return self._diem < other._diem

    def __len__(self):
        return len(self.ten)

# Sử dụng
sv1 = SinhVien("Nguyen An", "B001", 8.5)
sv2 = SinhVien.tu_chuoi("Le Binh|B002|9.0")

sv1.diem = 9.5         # dùng setter
print(sv1)             # SinhVien(Nguyen An, B001)
print(repr(sv2))
print(SinhVien.so_luong())   # 2
print(sorted([sv1, sv2]))    # sort theo điểm`,
        exercises:["BankAccount: nạp/rút tiền, không âm, lịch sử giao dịch","Circle class với @property: radius→area, perimeter tự tính","Implement class Stack dùng list (push/pop/peek/isEmpty)","Matrix class: +, *, transpose, pretty print"],
        results:["Tạo class hoàn chỉnh","@property getter/setter","@classmethod factory","Magic methods __str__, __eq__, __lt__"],
        hints:["self là positional arg đầu tiên — tên gì cũng được nhưng dùng self","@classmethod dùng cho factory, alternative constructors","__repr__ cho dev, __str__ cho user","__slots__ giảm 30-50% RAM khi nhiều instance"]
      },
      {
        num:"3.2", name:"Kế Thừa & Đa Hình", dur:"90 phút", diff:3,
        theory:"Kế thừa (inheritance) tái sử dụng code của class cha. Đa hình (polymorphism) cho phép cùng interface hành xử khác nhau tùy class. Python hỗ trợ multiple inheritance. super() gọi phương thức của class cha. ABC/abstractmethod định nghĩa interface bắt buộc.",
        steps:["class Child(Parent): — kế thừa","super().__init__() — gọi init của cha","Override method: định nghĩa lại trong class con","isinstance(obj, cls) — kiểm tra kể cả lớp con","from abc import ABC, abstractmethod — abstract class","Multiple inheritance + MRO (Method Resolution Order)"],
        code:`from abc import ABC, abstractmethod
import math

# Abstract Base Class
class HinhHoc(ABC):
    def __init__(self, mau: str = "đen"):
        self.mau = mau

    @abstractmethod
    def dien_tich(self) -> float: ...

    @abstractmethod
    def chu_vi(self) -> float: ...

    def mo_ta(self) -> str:      # concrete method
        return (f"{type(self).__name__}({self.mau}): "
                f"DT={self.dien_tich():.2f}, CV={self.chu_vi():.2f}")

class HinhTron(HinhHoc):
    def __init__(self, r: float, mau="xanh"):
        super().__init__(mau)
        self.r = r

    def dien_tich(self): return math.pi * self.r**2
    def chu_vi(self):    return 2 * math.pi * self.r

class HinhChuNhat(HinhHoc):
    def __init__(self, dai, rong):
        super().__init__()
        self.dai, self.rong = dai, rong

    def dien_tich(self): return self.dai * self.rong
    def chu_vi(self):    return 2*(self.dai+self.rong)

class HinhVuong(HinhChuNhat):    # kế thừa HinhChuNhat
    def __init__(self, canh):
        super().__init__(canh, canh)

# ĐA HÌNH — cùng gọi mo_ta() hành xử khác nhau
hinh_list = [HinhTron(5), HinhChuNhat(4,3), HinhVuong(6)]
for h in hinh_list:
    print(h.mo_ta())

# isinstance / issubclass
print(isinstance(HinhVuong(5), HinhChuNhat))  # True
print(issubclass(HinhVuong, HinhHoc))          # True

# MULTIPLE INHERITANCE + MRO
class A:
    def hello(self): return "A"
class B(A):
    def hello(self): return "B → " + super().hello()
class C(A):
    def hello(self): return "C → " + super().hello()
class D(B, C):   # Diamond inheritance
    pass

d = D()
print(d.hello())       # "B → C → A" (MRO: D→B→C→A)
print(D.__mro__)       # Method Resolution Order

# MIXIN pattern — thêm chức năng không liên quan đến logic
class JSONMixin:
    def to_json(self):
        import json
        return json.dumps(self.__dict__, ensure_ascii=False)

    @classmethod
    def from_json(cls, s):
        import json
        return cls(**json.loads(s))

class LogMixin:
    def log(self, msg):
        import datetime
        print(f"[{datetime.datetime.now():%H:%M:%S}] {type(self).__name__}: {msg}")

class SinhVien(JSONMixin, LogMixin):
    def __init__(self, ten, diem):
        self.ten = ten
        self.diem = diem

sv = SinhVien("An", 8.5)
print(sv.to_json())
sv.log("Đã cập nhật điểm")`,
        exercises:["Animal hierarchy: Animal→Mammal→Dog/Cat/Horse; Animal→Bird→Eagle","Tạo hệ thống tài khoản: Account→SavingAccount/CheckingAccount","Implement Observer pattern: EventEmitter với on/emit","Shape với Serializable mixin: to_dict/from_dict"],
        results:["super() đúng cách","Abstract class với ABC","Multiple inheritance","MRO hiểu rõ"],
        hints:["ABC: không instantiate được class abstract","super() không phải chỉ gọi cha trực tiếp — theo MRO","Mixin: thêm behavior, không có __init__ riêng thường","isinstance chọn hơn type() vì xét kế thừa"]
      },
      {
        num:"3.3", name:"Magic Methods & Dataclass", dur:"90 phút", diff:3,
        theory:"Magic methods (__dunder__) cho phép objects hành xử như built-in types. Operator overloading định nghĩa +, -, *, ==, < cho class. @dataclass (Python 3.7+) tự tạo __init__, __repr__, __eq__, và hỗ trợ frozen (immutable).",
        steps:["Arithmetic: __add__, __sub__, __mul__, __truediv__, __pow__","Comparison: __eq__, __lt__, __le__, __gt__, __ge__","Container: __len__, __getitem__, __setitem__, __contains__, __iter__","Context manager: __enter__, __exit__","__call__: object callable như hàm","@dataclass: tự động hóa boilerplate"],
        code:`# Operator overloading — Vector 2D
class Vector:
    def __init__(self, x: float, y: float):
        self.x, self.y = x, y

    def __add__(self, o): return Vector(self.x+o.x, self.y+o.y)
    def __sub__(self, o): return Vector(self.x-o.x, self.y-o.y)
    def __mul__(self, s): return Vector(self.x*s, self.y*s)
    def __rmul__(self, s): return self.__mul__(s)   # s * v
    def __neg__(self):    return Vector(-self.x, -self.y)
    def __abs__(self):    return (self.x**2+self.y**2)**0.5
    def __eq__(self, o):  return self.x==o.x and self.y==o.y
    def __bool__(self):   return self.x!=0 or self.y!=0
    def __repr__(self):   return f"Vector({self.x}, {self.y})"

v1, v2 = Vector(3, 4), Vector(1, 2)
print(v1 + v2)      # Vector(4, 6)
print(abs(v1))      # 5.0 (độ dài)
print(3 * v1)       # Vector(9, 12)

# Container protocol — custom list
class SortedList:
    def __init__(self): self._data = []
    def add(self, val):
        import bisect; bisect.insort(self._data, val)
    def __len__(self):      return len(self._data)
    def __getitem__(self, i):return self._data[i]
    def __contains__(self, v):return v in self._data
    def __iter__(self):     return iter(self._data)
    def __repr__(self):     return f"SortedList({self._data})"

sl = SortedList()
for x in [3,1,4,1,5]: sl.add(x)
print(sl)           # SortedList([1, 1, 3, 4, 5])
print(3 in sl)      # True
print(list(sl))     # [1, 1, 3, 4, 5]

# Context manager
import time
class Timer:
    def __enter__(self):
        self.t = time.perf_counter()
        return self
    def __exit__(self, *_):
        self.elapsed = time.perf_counter() - self.t
        print(f"⏱ {self.elapsed*1000:.2f}ms")

with Timer() as t:
    sum(range(1_000_000))

# __call__ — object callable
class RateLimiter:
    def __init__(self, max_calls):
        self.max = max_calls
        self.calls = 0
    def __call__(self, func):
        def wrapper(*a, **kw):
            if self.calls >= self.max:
                raise RuntimeError("Rate limit exceeded!")
            self.calls += 1
            return func(*a, **kw)
        return wrapper

# @dataclass — tự động boilerplate
from dataclasses import dataclass, field
from typing import List

@dataclass(order=True, frozen=False)
class SinhVien:
    ten:   str
    msv:   str
    diem:  float = 0.0
    mon:   List[str] = field(default_factory=list)

    def __post_init__(self):
        if not 0 <= self.diem <= 10:
            raise ValueError("Điểm không hợp lệ")

    @property
    def xep_loai(self): return "Giỏi" if self.diem>=8 else "Khá"

sv = SinhVien("An", "B001", 8.5, ["Mạng", "OOP"])
print(sv)         # SinhVien(ten='An', msv='B001', ...)
sv2 = SinhVien("An", "B001", 8.5, ["Mạng", "OOP"])
print(sv == sv2)  # True (auto __eq__)`,
        exercises:["Fraction class: +,-,*,/ với rút gọn, ==, <, str","Matrix với __add__, __mul__, __getitem__, pretty print","LimitedList: list tối đa n phần tử, xóa cũ khi đầy","Dùng @dataclass tạo struct Config với validation"],
        results:["Operator overloading đầy đủ","Container protocol","Context manager","@dataclass"],
        hints:["__radd__ cho x+obj khi x không biết cộng obj","frozen=True làm dataclass immutable (hashable)","field(default_factory=list) tránh mutable default bug","__slots__ + dataclass: thêm __slots__ class var"]
      }
    ]
  },
  {
    id:4, icon:"📁", color:"#fb923c",
    title:"File, JSON & Database",
    sub:"File I/O, CSV, JSON, SQLite, Pandas",
    labs:[
      {
        num:"4.1", name:"File I/O & pathlib", dur:"60 phút", diff:2,
        theory:"Python đọc/ghi file qua built-in open(). Luôn dùng with để tự động đóng. pathlib.Path là API hiện đại, cross-platform. Hỗ trợ text mode (mặc định) và binary mode (rb/wb).",
        steps:["open(path, mode, encoding='utf-8') — luôn specify encoding","Modes: 'r'(read), 'w'(write xóa cũ), 'a'(append), 'x'(tạo mới)","Đọc: read() toàn bộ, readline() từng dòng, readlines() list","Ghi: write(str), writelines(list)","pathlib.Path: p.read_text(), p.write_text(), p.glob('*.py')","shutil: copy, move, rmtree"],
        code:`# Đọc file — 3 cách
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()              # toàn bộ string
    
with open("data.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()           # list các dòng (với \\n)
    
with open("data.txt", "r", encoding="utf-8") as f:
    for line in f:                  # duyệt từng dòng (ít RAM nhất)
        print(line.strip())

# Ghi file
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("Dòng 1\\n")
    f.writelines(["Dòng 2\\n", "Dòng 3\\n"])

# Append (không xóa nội dung cũ)
with open("log.txt", "a", encoding="utf-8") as f:
    from datetime import datetime
    f.write(f"[{datetime.now():%Y-%m-%d %H:%M}] Log entry\\n")

# Binary mode
with open("image.png", "rb") as src, open("copy.png", "wb") as dst:
    dst.write(src.read())

# ─────────────────────────────────────
# PATHLIB — modern & cross-platform
from pathlib import Path

# Join path (cross-platform)
base = Path("data")
file_path = base / "students" / "list.txt"

# Tạo thư mục
file_path.parent.mkdir(parents=True, exist_ok=True)

# Đọc/ghi
file_path.write_text("Hello!\\nXin chào!", encoding="utf-8")
text = file_path.read_text(encoding="utf-8")

# Thông tin file
p = Path("script.py")
print(p.exists())          # True/False
print(p.is_file())         # True
print(p.is_dir())          # False
print(p.suffix)            # ".py"
print(p.stem)              # "script"
print(p.name)              # "script.py"
print(p.parent)            # Path('.')
print(p.stat().st_size)    # bytes

# Glob — tìm file theo pattern
for py_file in Path(".").glob("*.py"):
    print(py_file.name, py_file.stat().st_size)

for txt in Path(".").rglob("*.txt"):  # recursive
    print(txt)

# Rename / delete
p.rename("new_name.py")
p.unlink()                 # xóa file
# p.rmdir()                # xóa thư mục rỗng

# shutil cho thao tác phức tạp
import shutil
shutil.copy("src.py", "dst.py")
shutil.copy2("src.py", "backup/")    # copy + metadata
shutil.move("old.txt", "archive/")
shutil.rmtree("old_dir")             # xóa thư mục và toàn bộ nội dung`,
        exercises:["Đếm số dòng/từ/ký tự của file text (như wc)","Find & replace trong file: tìm pattern, thay thế, ghi lại","Merge nhiều .txt thành 1 file với separator","Script tự động tổ chức file theo extension vào thư mục riêng"],
        results:["Đọc/ghi file an toàn với with","pathlib.Path operations","glob pattern","shutil copy/move"],
        hints:["Luôn encoding='utf-8' khi xử lý tiếng Việt","r+ mode: read+write không xóa nội dung","seek(0) reset vị trí đọc","pathlib / là toán tử join path"]
      },
      {
        num:"4.2", name:"CSV & JSON", dur:"60 phút", diff:2,
        theory:"CSV và JSON là 2 format phổ biến nhất trao đổi dữ liệu. csv.DictReader/DictWriter dùng header làm key. json.load/dump cho file, json.loads/dumps cho string. requests+JSON dùng cho REST API.",
        steps:["csv.DictReader: đọc CSV thành list[dict]","csv.DictWriter: ghi list[dict] ra CSV","json.dumps(obj, ensure_ascii=False, indent=2): encode","json.loads(str): decode string","json.load(f) / json.dump(obj, f): file","Custom JSONEncoder cho datetime và custom objects"],
        code:`import csv, json

# ── CSV ──────────────────────────────
# Đọc
with open("sv.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    svs = list(reader)
    # [{"ten":"An","msv":"B001","diem":"8.5"}, ...]

# Ghi
data = [
    {"ten":"Nguyen An","msv":"B001","diem":8.5},
    {"ten":"Le Binh",  "msv":"B002","diem":9.0},
    {"ten":"Tran Chi", "msv":"B003","diem":7.5},
]
with open("output.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["ten","msv","diem"])
    writer.writeheader()
    writer.writerows(data)

# Đọc kiểu cơ bản (không có header)
with open("raw.csv", "r") as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)    # ['An', 'B001', '8.5']

# ── JSON ──────────────────────────────
# Encode Python → JSON string
obj = {
    "ten": "Nguyen An",
    "tags": ["python", "network"],
    "diem": 8.5
}
json_str = json.dumps(obj, ensure_ascii=False, indent=2)
print(json_str)

# Decode JSON string → Python
parsed = json.loads(json_str)
print(parsed["ten"])

# File I/O
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(obj, f, ensure_ascii=False, indent=2)

with open("data.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)

# Custom encoder cho datetime
import datetime
class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime.date, datetime.datetime)):
            return obj.isoformat()
        if hasattr(obj, '__dict__'):
            return obj.__dict__
        return super().default(obj)

record = {"ngay": datetime.date.today(), "gio": datetime.datetime.now()}
print(json.dumps(record, cls=DateTimeEncoder))

# REST API call
import urllib.request  # built-in, không cần requests

url = "https://jsonplaceholder.typicode.com/users/1"
with urllib.request.urlopen(url) as resp:
    user = json.loads(resp.read().decode())
    print(user["name"], user["email"])`,
        exercises:["Đọc CSV điểm SV, tính thống kê, ghi file mới có cột xếp loại","Chuyển đổi CSV ↔ JSON (2 chiều)","CRUD đơn giản dùng JSON file làm database","Fetch thời tiết từ OpenWeatherMap API, parse và hiển thị đẹp"],
        results:["DictReader/DictWriter","json.load/dump vs loads/dumps","Custom JSONEncoder","REST API với urllib"],
        hints:["newline='' khi ghi CSV trên Windows tránh dòng trống","ensure_ascii=False cho tiếng Việt","csv.DictReader tự dùng dòng đầu làm header","json.load() ≠ json.loads(): file vs string"]
      },
      {
        num:"4.3", name:"SQLite & Pandas", dur:"90 phút", diff:3,
        theory:"SQLite là database nhẹ không cần server, lưu trong 1 file. sqlite3 built-in trong Python. Pandas là library phân tích dữ liệu mạnh mẽ nhất: DataFrame = bảng dữ liệu với 100+ methods.",
        steps:["sqlite3.connect('db.sqlite3') → cursor → execute()","Parameterized query: execute('? ?', (val1,val2)) — chống SQL injection","CRUD: CREATE TABLE, INSERT, SELECT, UPDATE, DELETE","pd.read_csv(), pd.DataFrame()","Selection: df['col'], df[df['col']>5], df.loc[], df.iloc[]","GroupBy, merge, pivot_table, visualization"],
        code:`import sqlite3
from contextlib import contextmanager
import pandas as pd

# ── SQLITE3 ────────────────────────────
@contextmanager
def get_db(path="school.db"):
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row      # truy cập theo tên cột
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

# Tạo bảng
with get_db() as db:
    db.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id   INTEGER PRIMARY KEY AUTOINCREMENT,
            ten  TEXT NOT NULL,
            msv  TEXT UNIQUE NOT NULL,
            diem REAL DEFAULT 0.0,
            lop  TEXT
        )
    """)

# INSERT
def them_sv(ten, msv, diem, lop=None):
    with get_db() as db:
        db.execute(
            "INSERT INTO students(ten,msv,diem,lop) VALUES(?,?,?,?)",
            (ten, msv, diem, lop)    # ✅ parameterized
        )

them_sv("Nguyen An", "B001", 8.5, "CNTT22")
them_sv("Le Binh",   "B002", 9.0, "CNTT22")

# SELECT
def lay_all(order="diem DESC"):
    with get_db() as db:
        rows = db.execute(f"SELECT * FROM students ORDER BY {order}").fetchall()
        return [dict(r) for r in rows]

# UPDATE / DELETE
def cap_nhat_diem(msv, diem):
    with get_db() as db:
        db.execute("UPDATE students SET diem=? WHERE msv=?", (diem, msv))

def xoa_sv(msv):
    with get_db() as db:
        db.execute("DELETE FROM students WHERE msv=?", (msv,))

# ── PANDAS ────────────────────────────
# Tạo DataFrame
df = pd.DataFrame(lay_all())
print(df.info())
print(df.describe())

# Selection
print(df[df["diem"] >= 8.0])           # boolean index
print(df.loc[0])                        # row đầu
print(df.iloc[0:3, 1:3])               # rows 0-2, cols 1-2

# Tạo cột mới
df["xep_loai"] = df["diem"].apply(
    lambda d: "Giỏi" if d>=8 else "Khá" if d>=6.5 else "TB"
)

# GroupBy
print(df.groupby("lop")["diem"].agg(["mean","max","min","count"]))

# Đọc từ CSV/JSON
df_csv = pd.read_csv("students.csv", encoding="utf-8")
df_json = pd.read_json("students.json")

# Cleaning
df.dropna(inplace=True)                 # xóa dòng NaN
df["diem"] = df["diem"].fillna(df["diem"].mean())

# Export
df.to_csv("report.csv", index=False, encoding="utf-8")
df.to_json("report.json", orient="records", force_ascii=False)

# Visualization (cần matplotlib)
import matplotlib.pyplot as plt
df["diem"].hist(bins=5)
plt.title("Phân phối điểm")
plt.savefig("histogram.png")`,
        exercises:["Hệ thống thư viện: Book/Member/Borrow tables + full CRUD","Export database SQLite → DataFrame → biểu đồ + báo cáo PDF","Phân tích 1000 điểm SV: histogram, boxplot, heatmap correlation","Tạo simple ORM: Model class tự map với SQLite table"],
        results:["CRUD SQLite an toàn","Parameterized queries","DataFrame operations","GroupBy và visualization"],
        hints:["Không bao giờ dùng f-string trong SQL (SQL injection)","fetchone() / fetchall() / fetchmany(n)","row_factory=sqlite3.Row: dict-like access","pd.read_csv() có nhiều options: sep, skiprows, dtype"]
      }
    ]
  },
  {
    id:5, icon:"⚡", color:"#a78bfa",
    title:"Module & Lập Trình Nâng Cao",
    sub:"RegEx, Threading, Async, Testing, Type Hints",
    labs:[
      {
        num:"5.1", name:"Regular Expressions", dur:"90 phút", diff:3,
        theory:"Regular Expression là ngôn ngữ pattern matching mạnh mẽ. Module re của Python. Dùng raw string r'' để tránh escape conflict. Quan trọng cho validation, parsing, text processing.",
        steps:["re.search() tìm bất kỳ vị trí; re.match() từ đầu chuỗi","re.findall() tất cả match; re.sub() thay thế","Metacharacters: . * + ? {} [] ^ $ | ( )","Character classes: \\d \\w \\s \\b","Groups: () capture, (?:) non-capture, (?P<name>) named","Lookahead: (?=) positive, (?!) negative; Lookbehind: (?<=)"],
        code:`import re

text = "Email: abc@gmail.com và xyz@dlu.edu.vn. SĐT: 0912345678"

# Cơ bản
print(re.findall(r'\\d+', text))         # ['0912345678']
m = re.search(r'\\d{10}', text)
if m: print(m.group())                  # '0912345678'

# Email pattern
EMAIL = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
print(re.findall(EMAIL, text))

# Phone VN
PHONE_VN = r'(?:0|\\+84)[3-9]\\d{8}'
print(re.findall(PHONE_VN, text))

# Groups — capture
DATE = r'(\\d{1,2})/(\\d{1,2})/(\\d{4})'
text2 = "Ngày 25/12/2024 đến 01/01/2025"
for m in re.finditer(DATE, text2):
    day, month, year = m.groups()
    print(f"{year}-{month:>02}-{day:>02}")

# Named groups
NAMED = r'(?P<day>\\d{1,2})/(?P<month>\\d{1,2})/(?P<year>\\d{4})'
m = re.search(NAMED, text2)
print(m.groupdict())   # {'day': '25', 'month': '12', 'year': '2024'}

# re.sub — thay thế
result = re.sub(r'\\d{4}', 'XXXX', text2)   # ẩn năm
print(result)

# re.sub với function
def double_num(m):
    return str(int(m.group()) * 2)
print(re.sub(r'\\d+', double_num, "a1b2c3"))  # a2b4c6

# Flags
HTML = "<div>Hello <b>World</b></div>"
print(re.sub(r'<[^>]+>', '', HTML))           # strip tags
print(re.findall(r'\\bpython\\b', "Python python PYTHON",
                 re.IGNORECASE))

# Compile — tốt hơn khi dùng nhiều lần
email_re = re.compile(EMAIL, re.IGNORECASE)
print(email_re.findall("Test: A@B.com, c@d.edu"))

# Lookahead / lookbehind
prices = "100USD 200EUR 50VND"
# Tìm số trước đơn vị tiền
nums = re.findall(r'\\d+(?=[A-Z]{3})', prices)
print(nums)          # ['100', '200', '50']
# Tìm đơn vị sau số
units = re.findall(r'(?<=\\d)[A-Z]{3}', prices)
print(units)         # ['USD', 'EUR', 'VND']

# Validate functions
def is_valid_email(email: str) -> bool:
    return bool(re.fullmatch(r'[\\w.+-]+@[\\w-]+\\.[\\w.]+', email))

def is_strong_password(pw: str) -> bool:
    # >=8 ký tự, có chữ hoa, thường, số, ký tự đặc biệt
    return bool(re.fullmatch(
        r'(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w]).{8,}', pw))`,
        exercises:["Extract tất cả URL từ HTML string","Parser log Apache: IP, timestamp, method, path, status, size","Validate CCCD Việt Nam (12 số), tên file hợp lệ","Find & replace trong file hàng loạt (grep+sed Python)"],
        results:["Dùng regex cơ bản và nâng cao","Named groups","re.sub với function","Lookahead/lookbehind"],
        hints:["r'' tránh escape hell: r'\\d+' thay '\\\\d+'","re.compile() cho performance khi dùng nhiều lần","fullmatch() so với cả string; match() chỉ từ đầu","re.VERBOSE: viết regex nhiều dòng có comment"]
      },
      {
        num:"5.2", name:"Decorators Nâng Cao", dur:"90 phút", diff:4,
        theory:"Decorator là higher-order function: nhận hàm, trả hàm được wrapped thêm behavior. Dùng functools.wraps để giữ metadata. Decorator với tham số cần thêm 1 cấp function. functools cung cấp lru_cache, partial, reduce.",
        steps:["Decorator cơ bản: def dec(func): def wrapper(*a,**kw): ...","@functools.wraps(func) giữ __name__, __doc__","Decorator có tham số: thêm 1 lớp ngoài","Stacking decorators: áp từ dưới lên","Class-based decorator: implement __call__","functools: lru_cache, partial, reduce, singledispatch"],
        code:`import functools
import time

# Decorator cơ bản
def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - t0
        print(f"⏱ {func.__name__} took {elapsed*1000:.2f}ms")
        return result
    return wrapper

# Decorator có tham số
def retry(times=3, delay=0, exceptions=(Exception,)):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == times - 1:
                        raise
                    print(f"Attempt {attempt+1} failed: {e}")
                    if delay: time.sleep(delay)
        return wrapper
    return decorator

# Memoize (cache)
def memoize(func):
    cache = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    wrapper.cache = cache             # expose cache
    wrapper.clear_cache = cache.clear
    return wrapper

@memoize
def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)

# Hoặc built-in
from functools import lru_cache
@lru_cache(maxsize=None)
def fib2(n):
    if n < 2: return n
    return fib2(n-1) + fib2(n-2)

# Stacking decorators
@timer
@retry(times=3, exceptions=(ValueError,))
@memoize
def risky(x):
    import random
    if random.random() < 0.5: raise ValueError("Bad luck")
    return x * 2

# Class-based decorator
class RateLimit:
    def __init__(self, calls_per_sec):
        self.interval = 1.0 / calls_per_sec
        self.last = 0
    def __call__(self, func):
        @functools.wraps(func)
        def wrapper(*a, **kw):
            now = time.time()
            diff = now - self.last
            if diff < self.interval:
                time.sleep(self.interval - diff)
            self.last = time.time()
            return func(*a, **kw)
        return wrapper

@RateLimit(calls_per_sec=2)
def api_call(url): pass

# functools extras
# partial: fix some args
from functools import partial
power_of_2 = partial(pow, 2)    # power_of_2(n) = 2**n
print(list(map(power_of_2, range(6))))   # [1,2,4,8,16,32]

# singledispatch: function overloading
from functools import singledispatch
@singledispatch
def process(arg):
    print(f"Default: {arg}")

@process.register(int)
def _(arg): print(f"Int: {arg * 2}")

@process.register(str)
def _(arg): print(f"Str: {arg.upper()}")

process(42)       # Int: 84
process("hello")  # Str: HELLO`,
        exercises:["@validate_types: kiểm tra kiểu tham số theo type hints","@cache_to_disk: lưu cache ra file pickle","@log_calls: log tên hàm, args, return value, time","Implement @property từ đầu không dùng built-in"],
        results:["Decorator cơ bản và có tham số","functools.wraps","@lru_cache","singledispatch"],
        hints:["wraps() giữ __name__, __doc__, __wrapped__","Decorator áp từ trong ra ngoài, chạy từ ngoài vào trong","lru_cache args phải hashable","partial() hữu ích với map/filter/sorted key="]
      },
      {
        num:"5.3", name:"Testing với pytest", dur:"60 phút", diff:3,
        theory:"Testing đảm bảo code đúng và không regression. pytest là framework hiện đại nhất. TDD (Test-Driven Development) viết test trước code. Mock/patch thay thế dependencies khi test. Coverage đo phần trăm code được test.",
        steps:["pytest: file test_*.py, hàm test_*()","assert statements — pytest có output đẹp","Fixtures: setup/teardown với @pytest.fixture","@pytest.mark.parametrize: test nhiều case","from unittest.mock import Mock, patch","pytest --cov=module: coverage report"],
        code:`# calculator.py
def add(a, b): return a + b
def divide(a, b):
    if b == 0: raise ZeroDivisionError("Cannot divide by zero")
    return a / b

# test_calculator.py
import pytest
from calculator import add, divide

# Test cơ bản
def test_add_positive():
    assert add(2, 3) == 5

def test_add_negative():
    assert add(-1, -2) == -3

def test_add_float():
    assert add(0.1, 0.2) == pytest.approx(0.3, rel=1e-6)

# Test exception
def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError):
        divide(10, 0)

def test_divide_by_zero_message():
    with pytest.raises(ZeroDivisionError, match="zero"):
        divide(1, 0)

# Parametrize — test nhiều case
@pytest.mark.parametrize("a,b,expected", [
    (1, 2, 3),
    (-1, 1, 0),
    (0, 0, 0),
    (100, -50, 50),
    pytest.param(1, "x", None, marks=pytest.mark.xfail),
])
def test_add_parametrized(a, b, expected):
    assert add(a, b) == expected

# Fixtures
@pytest.fixture
def sample_data():
    return [3, 1, 4, 1, 5, 9, 2, 6]

@pytest.fixture(scope="module")
def db_connection():
    """Setup/teardown với yield"""
    import sqlite3
    conn = sqlite3.connect(":memory:")
    yield conn
    conn.close()

def test_sorted(sample_data):
    assert sorted(sample_data) == [1,1,2,3,4,5,6,9]

def test_db(db_connection):
    db_connection.execute("CREATE TABLE t (x INT)")
    assert db_connection is not None

# Mock
from unittest.mock import Mock, patch, MagicMock

def test_api_call():
    with patch("requests.get") as mock_get:
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {"status": "ok"}
        
        import requests
        resp = requests.get("https://api.test.com")
        assert resp.status_code == 200
        mock_get.assert_called_once_with("https://api.test.com")

# Chạy:
# pytest -v                          # verbose
# pytest -v test_calculator.py       # 1 file
# pytest --cov=calculator --cov-report=html  # coverage`,
        exercises:["Test suite đầy đủ cho class BankAccount (>90% coverage)","TDD: viết test trước, rồi implement Stack class","Mock HTTP requests để test hàm gọi API","Parametrize test kiểm tra validate_email với 20 cases"],
        results:["Viết và chạy pytest","Parametrize","Fixtures","Mock/Patch"],
        hints:["pytest.approx cho float comparison","Fixture scope: function/class/module/session","monkeypatch fixture: thay đổi builtins, env vars","conftest.py: fixtures dùng chung nhiều file test"]
      },
      {
        num:"5.4", name:"Async & Threading", dur:"90 phút", diff:4,
        theory:"GIL (Global Interpreter Lock) giới hạn 1 thread Python chạy cùng lúc. Threading tốt cho I/O-bound tasks. Multiprocessing bypass GIL, tốt cho CPU-bound. asyncio là event loop, coroutine không blocking — tốt nhất cho I/O-bound concurrent.",
        steps:["threading.Thread(target=f, args=(x,)).start()","ThreadPoolExecutor cho pool thread dễ dùng","asyncio.run(main()) — entry point","async def + await — coroutine","asyncio.gather(*tasks) — chạy song song","multiprocessing.Pool cho CPU-bound"],
        code:`import threading
import asyncio
import time
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

# ── THREADING ────────────────────────
def download_file(url, results, idx):
    time.sleep(0.3)        # simulate network
    results[idx] = f"Downloaded: {url}"

urls = [f"http://example.com/file{i}" for i in range(5)]
results = [None] * len(urls)

# Manual threads
threads = []
for i, url in enumerate(urls):
    t = threading.Thread(target=download_file, args=(url, results, i))
    threads.append(t)
    t.start()

for t in threads:
    t.join()               # đợi tất cả xong

# ThreadPoolExecutor (cleaner)
def fetch(url: str) -> str:
    time.sleep(0.3)
    return f"Content of {url}"

with ThreadPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(fetch, urls))    # order preserved

# Thread-safe với Lock
counter = 0
lock = threading.Lock()

def increment():
    global counter
    with lock:             # atomic increment
        counter += 1

# ── ASYNCIO ───────────────────────────
async def async_fetch(session_name: str, url: str) -> str:
    await asyncio.sleep(0.3)   # non-blocking wait
    return f"[{session_name}] {url}"

async def main():
    # Chạy song song — cùng lúc!
    tasks = [async_fetch(f"s{i}", url) for i, url in enumerate(urls)]
    results = await asyncio.gather(*tasks)
    for r in results:
        print(r)

asyncio.run(main())

# Semaphore — giới hạn concurrent
async def limited_main():
    sem = asyncio.Semaphore(2)    # max 2 cùng lúc

    async def bounded_fetch(url):
        async with sem:
            return await async_fetch("worker", url)

    results = await asyncio.gather(*[bounded_fetch(u) for u in urls])

asyncio.run(limited_main())

# Async generator
async def arange(n):
    for i in range(n):
        await asyncio.sleep(0)
        yield i

async def use_arange():
    async for i in arange(5):
        print(i)

# ── MULTIPROCESSING ───────────────────
def is_prime(n):
    if n < 2: return False
    for i in range(2, int(n**0.5)+1):
        if n % i == 0: return False
    return True

if __name__ == "__main__":   # bắt buộc khi dùng multiprocessing
    with ProcessPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(is_prime, range(1, 10001)))
        primes = [n for n, is_p in enumerate(results, 1) if is_p]`,
        exercises:["Download 50 URL song song với ThreadPoolExecutor, so sánh tốc độ","Tính số nguyên tố 1-1M: serial vs threading vs multiprocessing","Async web scraper với aiohttp, giới hạn 5 concurrent","Producer-Consumer với asyncio.Queue"],
        results:["Threading vs Multiprocessing khi nào dùng","ThreadPoolExecutor","asyncio.gather + Semaphore","asyncio.run() entry point"],
        hints:["GIL: threading không bypass — dùng multiprocessing cho CPU","asyncio không thread-safe — chạy 1 event loop","if __name__=='__main__' bắt buộc multiprocessing Windows","aiohttp thay requests trong async code"]
      }
    ]
  },
  {
    id:6, icon:"🚀", color:"#fbbf24",
    title:"Dự Án Thực Tiễn",
    sub:"CLI App, Web Scraping, REST API, Data Analysis",
    labs:[
      {
        num:"6.1", name:"CLI App với Typer & Rich", dur:"90 phút", diff:3,
        theory:"CLI (Command Line Interface) tools automation hóa công việc. Typer (dựa trên type hints) và Click là 2 library phổ biến nhất. Rich tạo output đẹp với color, table, progress bar.",
        steps:["pip install typer rich tqdm","@app.command() định nghĩa lệnh","typer.Argument: positional; typer.Option: --flag","rich.Console, rich.Table cho output đẹp","rich.progress.track() cho progress bar","Đóng gói: pyproject.toml + scripts entry point"],
        code:`# pip install typer rich
import typer
from rich.console import Console
from rich.table import Table
from rich.progress import track
from pathlib import Path
import json

app = typer.Typer(help="📚 Quản lý Sinh Viên — DLU CNTT")
console = Console()
DB = Path("students.json")

def load(): return json.loads(DB.read_text()) if DB.exists() else []
def save(d): DB.write_text(json.dumps(d, ensure_ascii=False, indent=2))

@app.command("them")
def add_student(
    ten:  str = typer.Argument(..., help="Tên sinh viên"),
    msv:  str = typer.Argument(..., help="Mã số SV"),
    diem: float = typer.Option(0.0, "--diem", "-d", help="Điểm TB"),
    lop:  str   = typer.Option("", "--lop",  "-l", help="Lớp"),
):
    """Thêm sinh viên mới vào database."""
    data = load()
    if any(s["msv"] == msv for s in data):
        console.print(f"[red]❌ MSV {msv} đã tồn tại![/red]")
        raise typer.Exit(code=1)
    data.append({"ten": ten, "msv": msv, "diem": diem, "lop": lop})
    save(data)
    console.print(f"[green]✅ Đã thêm: [bold]{ten}[/bold] ({msv})[/green]")

@app.command("ds")
def list_students(
    sort:    str  = typer.Option("ten", "--sort", "-s",
                                  help="Sắp xếp theo: ten/diem/msv"),
    reverse: bool = typer.Option(False, "--desc", help="Giảm dần"),
    lop:     str  = typer.Option("",   "--lop",  help="Lọc theo lớp"),
):
    """Hiển thị danh sách sinh viên."""
    data = load()
    if lop: data = [s for s in data if s.get("lop") == lop]
    data.sort(key=lambda x: x.get(sort, ""), reverse=reverse)

    table = Table(title="📋 Danh Sách Sinh Viên", border_style="blue")
    table.add_column("STT",    style="cyan",    justify="right", width=5)
    table.add_column("Tên",    style="green",   width=20)
    table.add_column("MSV",    style="yellow",  width=8)
    table.add_column("Điểm",  style="magenta", justify="right", width=8)
    table.add_column("Xếp Loại", style="white", width=12)
    table.add_column("Lớp",   style="blue",    width=10)

    for i, s in enumerate(data, 1):
        d = s["diem"]
        xl = ("🏆 Giỏi" if d>=8 else "🥈 Khá" if d>=6.5 else "📘 TB")
        table.add_row(str(i), s["ten"], s["msv"],
                      f"{d:.1f}", xl, s.get("lop",""))

    console.print(table)
    console.print(f"[dim]Tổng: {len(data)} sinh viên[/dim]")

@app.command("import")
def import_csv(
    file: Path = typer.Argument(..., help="File CSV đầu vào"),
):
    """Import sinh viên từ file CSV."""
    import csv
    data = load()
    rows = list(csv.DictReader(file.open(encoding="utf-8")))
    added = 0
    for row in track(rows, description="Đang import..."):
        if not any(s["msv"]==row["msv"] for s in data):
            data.append({**row, "diem": float(row.get("diem",0))})
            added += 1
    save(data)
    console.print(f"[green]✅ Đã import {added}/{len(rows)} SV[/green]")

if __name__ == "__main__":
    app()
# python app.py them "Nguyen An" B001 --diem 8.5 --lop CNTT22
# python app.py ds --sort diem --desc
# python app.py import students.csv`,
        exercises:["Thêm lệnh xoa, sua, tim cho student CLI","Export CSV/JSON với --format option","CLI tool rename file hàng loạt với pattern","Password manager CLI với cryptography (Fernet)"],
        results:["Typer CLI application","Rich table","Progress bar","argparse → typer migration"],
        hints:["typer.Argument: positional, typer.Option: --flag","Rich markup: [bold red]text[/bold red]","Enum option: giới hạn giá trị hợp lệ","typer.Exit(code=1) cho error exit code"]
      },
      {
        num:"6.2", name:"Web Scraping", dur:"90 phút", diff:3,
        theory:"Web scraping tự động trích xuất dữ liệu từ web. requests + BeautifulSoup4 cho static pages. Selenium/Playwright cho dynamic JavaScript pages. Luôn kiểm tra robots.txt và Terms of Service trước khi scrape.",
        steps:["pip install requests beautifulsoup4 lxml","requests.get(url, headers={'User-Agent':...})","soup.find() tìm 1; soup.find_all() tìm tất cả","CSS selector: soup.select('.class #id')","Pagination: tìm next page link","Rate limiting: time.sleep() tránh bị ban"],
        code:`import requests
from bs4 import BeautifulSoup
import time, random
from pathlib import Path

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; PythonBot/1.0)"
}

def get_soup(url: str) -> BeautifulSoup:
    resp = requests.get(url, headers=HEADERS, timeout=15)
    resp.raise_for_status()
    return BeautifulSoup(resp.text, "lxml")

# Scrape Wikipedia
def scrape_wiki(topic: str) -> dict:
    url = f"https://vi.wikipedia.org/wiki/{topic}"
    soup = get_soup(url)

    title = soup.find("h1", id="firstHeading").get_text()

    # CSS selector
    content_div = soup.select_one("#mw-content-text .mw-parser-output")
    paragraphs = content_div.select("p")
    intro = next((p.get_text() for p in paragraphs if len(p.get_text()) > 50), "")

    # Tất cả link nội bộ
    links = []
    for a in content_div.select("a[href^='/wiki/']"):
        href = a.get("href", "")
        if ":" not in href:
            links.append({"text": a.get_text(), "url": f"https://vi.wikipedia.org{href}"})

    return {"title": title, "intro": intro[:300], "links": links[:10]}

# Scrape với pagination
def scrape_pages(base_url: str, max_pages=5) -> list:
    all_items = []
    page = 1

    while page <= max_pages:
        soup = get_soup(f"{base_url}?page={page}")
        items = soup.select(".product-card")

        if not items:
            break

        for item in items:
            all_items.append({
                "name":  item.select_one(".name").get_text(strip=True),
                "price": item.select_one(".price").get_text(strip=True),
                "link":  item.select_one("a")["href"],
            })

        page += 1
        time.sleep(random.uniform(1, 2.5))  # polite delay!

    return all_items

# Tải ảnh
def download_images(image_urls: list, folder="images"):
    Path(folder).mkdir(exist_ok=True)
    for i, url in enumerate(image_urls):
        ext = url.rsplit(".", 1)[-1].split("?")[0]
        path = Path(folder) / f"image_{i:04d}.{ext}"
        resp = requests.get(url, stream=True, timeout=15)
        with open(path, "wb") as f:
            for chunk in resp.iter_content(8192):
                f.write(chunk)
        print(f"✅ {path}")
        time.sleep(0.5)

# Lưu kết quả
import pandas as pd
items = []  # = scrape_pages(...)
df = pd.DataFrame(items)
df.to_csv("scraped.csv", index=False, encoding="utf-8")
df.to_json("scraped.json", orient="records", force_ascii=False)`,
        exercises:["Scrape tin tức: tiêu đề + tóm tắt + ngày từ vnexpress.net","Download tất cả ảnh từ một trang gallery","Monitor giá sản phẩm, alert khi giảm (chạy cron job)","Scrape và lưu vào SQLite với upsert"],
        results:["BeautifulSoup CSS selectors","Pagination","Tải ảnh binary","Rate limiting + polite scraping"],
        hints:["Kiểm tra robots.txt: /robots.txt trước khi scrape","User-Agent giả mạo browser thật","soup.get_text(strip=True) tự trim whitespace","requests.Session() tái sử dụng connection, có cookie"]
      },
      {
        num:"6.3", name:"REST API với FastAPI", dur:"90 phút", diff:4,
        theory:"FastAPI là web framework hiện đại nhất Python: async, type-safe, tự tạo Swagger docs. Pydantic validation ngay ở route. Rất phổ biến cho ML APIs, microservices. Truy cập /docs sau khi chạy để xem Swagger UI.",
        steps:["pip install fastapi uvicorn[standard]","@app.get/post/put/delete('/path')","Pydantic BaseModel cho request body","Path params: /items/{item_id}","Query params: def f(q: str = None)","Response model kiểm soát output","uvicorn main:app --reload để dev"],
        code:`# pip install fastapi uvicorn[standard]
from fastapi import FastAPI, HTTPException, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
import uvicorn

app = FastAPI(
    title="Student API — DLU CNTT",
    description="REST API quản lý sinh viên",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Pydantic Models
class SVBase(BaseModel):
    ten:  str  = Field(..., min_length=2, max_length=50, examples=["Nguyen An"])
    msv:  str  = Field(..., pattern=r"^[A-Z]\\d{3}$",   examples=["B001"])
    diem: float = Field(0.0, ge=0.0, le=10.0)
    lop:  Optional[str] = None

    @field_validator("ten")
    @classmethod
    def title_case(cls, v): return v.strip().title()

class SVCreate(SVBase): pass

class SVResponse(SVBase):
    id:       int
    xep_loai: str

# In-memory database
_db: List[dict] = []
_id_counter = 0

def _xep_loai(d): return "Giỏi" if d>=8 else "Khá" if d>=6.5 else "TB"

# ── ENDPOINTS ─────────────────────────
@app.get("/", tags=["Root"])
def root():
    return {"message": "Student API v2.0", "docs": "/docs"}

@app.get("/students", response_model=List[SVResponse], tags=["Students"])
def get_all(
    lop:     Optional[str]  = Query(None, description="Lọc theo lớp"),
    min_d:   float          = Query(0.0, ge=0, le=10, alias="min_diem"),
    sort_by: str            = Query("ten", enum=["ten","diem","msv"]),
    desc:    bool           = Query(False),
):
    data = [s for s in _db if s["diem"] >= min_d]
    if lop: data = [s for s in data if s.get("lop") == lop]
    data.sort(key=lambda x: x[sort_by], reverse=desc)
    return data

@app.get("/students/{sv_id}", response_model=SVResponse, tags=["Students"])
def get_one(sv_id: int = Path(..., ge=1)):
    sv = next((s for s in _db if s["id"] == sv_id), None)
    if not sv:
        raise HTTPException(404, detail=f"Không tìm thấy SV id={sv_id}")
    return sv

@app.post("/students", response_model=SVResponse,
          status_code=201, tags=["Students"])
def create(sv: SVCreate):
    global _id_counter
    if any(s["msv"] == sv.msv for s in _db):
        raise HTTPException(400, detail=f"MSV {sv.msv} đã tồn tại")
    _id_counter += 1
    new = {"id": _id_counter, **sv.model_dump(),
           "xep_loai": _xep_loai(sv.diem)}
    _db.append(new)
    return new

@app.put("/students/{sv_id}", response_model=SVResponse, tags=["Students"])
def update(sv_id: int, sv: SVCreate):
    idx = next((i for i,s in enumerate(_db) if s["id"]==sv_id), None)
    if idx is None:
        raise HTTPException(404, "Không tìm thấy")
    _db[idx].update({**sv.model_dump(), "xep_loai": _xep_loai(sv.diem)})
    return _db[idx]

@app.delete("/students/{sv_id}", status_code=204, tags=["Students"])
def delete(sv_id: int):
    global _db
    _db = [s for s in _db if s["id"] != sv_id]

@app.get("/stats", tags=["Analytics"])
def stats():
    if not _db: return {}
    diems = [s["diem"] for s in _db]
    return {"total": len(_db), "avg": sum(diems)/len(diems),
            "max": max(diems), "min": min(diems)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
# uvicorn main:app --reload → http://localhost:8000/docs`,
        exercises:["Thêm JWT authentication (python-jose + passlib)","Thêm SQLite + SQLAlchemy thay in-memory","File upload endpoint: import CSV sinh viên","Deploy lên Render.com với Dockerfile"],
        results:["FastAPI CRUD hoàn chỉnh","Pydantic validation","Auto Swagger docs","Response model"],
        hints:["Truy cập /docs để xem Swagger UI interactive","response_model kiểm soát fields trả về","HTTPException với status_code và detail","Depends() cho dependency injection (auth, db)"]
      }
    ]
  }
];

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export default function PythonApp({ onHome }) {
  const [view, setView]     = useState("overview");
  const [openMod, setOpenMod] = useState(null);
  const [openLab, setOpenLab] = useState(null);
  const [labTab, setLabTab]   = useState("theory");

  const totalLabs = MODS.reduce((s, m) => s + m.labs.length, 0);
  const totalEx   = MODS.reduce((s, m) => s + m.labs.reduce((a, l) => a + l.exercises.length, 0), 0);

  return (
    <div style={{background:"#07080c",minHeight:"100vh",color:"#dde6d5",
      fontFamily:"'JetBrains Mono','Fira Code',monospace",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:#4ade8033;border-radius:2px}
        ::-webkit-scrollbar-track{background:#07080c}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}
        @keyframes snake{0%{stroke-dashoffset:100}100%{stroke-dashoffset:0}}
        .fade{animation:fadeUp .2s ease}
        .pulse{animation:pulse 2s infinite}
        button{cursor:pointer;font-family:inherit;transition:all .15s}
        pre{white-space:pre-wrap;word-break:break-word;font-family:'JetBrains Mono',monospace}
        @media(max-width:600px){.hide-sm{display:none!important}}
      `}</style>

      {/* ── HEADER ─────────────────────────── */}
      <header style={{background:"linear-gradient(180deg,#0b120b,#07080c)",
        borderBottom:"1px solid #4ade8018",padding:"10px 14px",
        display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:50}}>

        <button onClick={onHome}
          style={{background:"#0a1a0a",border:"1px solid #4ade8030",borderRadius:6,
            color:"#4ade80",padding:"5px 11px",fontSize:11,flexShrink:0}}>
          ← Home
        </button>

        <div style={{width:36,height:36,borderRadius:8,
          background:"linear-gradient(135deg,#4ade8020,#22c55e15)",
          border:"1px solid #4ade8035",display:"flex",alignItems:"center",
          justifyContent:"center",fontSize:20,flexShrink:0}}>🐍</div>

        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:16,
            color:"#4ade80",letterSpacing:1,lineHeight:1}}>
            PYTHON LAB
          </div>
          <div className="hide-sm" style={{fontSize:9,color:"#1a3a1a",marginTop:2,letterSpacing:2}}>
            CƠ BẢN → NÂNG CAO · {MODS.length} MODULES · {totalLabs} LABS · {totalEx}+ BÀI TẬP
          </div>
        </div>

        <div className="hide-sm" style={{display:"flex",gap:4}}>
          {[["🐣","Basics","#4ade80"],["📦","Data","#60a5fa"],
            ["🏛️","OOP","#f472b6"],["⚡","Advanced","#fbbf24"],
            ["🚀","Projects","#fb923c"]].map(([ic,l,c])=>(
            <div key={l} style={{background:`${c}10`,border:`1px solid ${c}25`,
              borderRadius:5,padding:"2px 7px",fontSize:9,color:c}}>
              {ic} {l}
            </div>
          ))}
        </div>
      </header>

      {/* ── INSTRUCTOR BAR ─────────────────── */}
      <div style={{background:"#05090a",borderBottom:"1px solid #0a1f10",
        padding:"6px 14px",display:"flex",gap:8,alignItems:"center",
        fontSize:10,flexWrap:"wrap"}}>
        <span>👨‍🏫</span>
        <span style={{color:"#4ade80",fontWeight:700}}>Vũ Minh Quan</span>
        <span style={{color:"#1a3a1a"}}>|</span>
        <a href="mailto:quanvm@dlu.edu.vn" style={{color:"#2a7a3a"}}>quanvm@dlu.edu.vn</a>
        <span className="hide-sm" style={{color:"#1a3a1a"}}>|</span>
        <span className="hide-sm" style={{color:"#1a4a2a"}}>Đại học Đà Lạt · Khoa CNTT</span>
        <div style={{marginLeft:"auto",display:"flex",gap:6}}>
          {[["Mã HP","20CT3125"],["TC","3"],["Labs",totalLabs]].map(([l,v])=>(
            <div key={l} style={{background:"#0a1a0a",border:"1px solid #4ade8018",
              borderRadius:4,padding:"1px 8px",fontSize:9,color:"#3a7a3a"}}>
              {l}: <span style={{color:"#4ade80"}}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── NAV TABS ───────────────────────── */}
      <nav style={{display:"flex",borderBottom:"1px solid #0a1f10",
        background:"#05090a",overflowX:"auto"}}>
        {[["overview","🗺️","Tổng Quan"],
          ["modules","📚","Modules & Labs"],
          ["ref","📖","Quick Ref"]].map(([k,ic,l])=>(
          <button key={k} onClick={()=>setView(k)}
            style={{background:view===k?"#0b1a0b":"transparent",
              border:"none",borderBottom:view===k?"2px solid #4ade80":"2px solid transparent",
              color:view===k?"#4ade80":"#1a4a1a",padding:"9px 14px",
              fontSize:11,flexShrink:0,whiteSpace:"nowrap"}}>
            {ic} {l}
          </button>
        ))}
      </nav>

      <main style={{padding:"12px 14px",maxWidth:1100,margin:"0 auto"}}>

        {/* ══ OVERVIEW ══════════════════════════ */}
        {view==="overview" && (
          <div className="fade">
            {/* Stats Row */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",
              gap:8,marginBottom:14}}>
              {[
                ["🏗️",totalLabs,"Labs thực hành","#4ade80"],
                ["✏️",totalEx+"+"  ,"Bài tập","#60a5fa"],
                [MODS.length+"","Modules","Chủ đề lớn","#f472b6"],
                ["🐍","3.6+","Python version","#fbbf24"],
              ].map(([ic,v,l,c],i)=>(
                <div key={i} style={{background:"#0b0f0b",border:`1px solid ${c}20`,
                  borderLeft:`3px solid ${c}`,borderRadius:8,padding:"10px 12px"}}>
                  <div style={{fontSize:18,marginBottom:4}}>{ic}</div>
                  <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,
                    fontSize:20,color:c}}>{v}</div>
                  <div style={{fontSize:9,color:"#2a4a2a",marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>

            {/* Module Cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:8,marginBottom:14}}>
              {MODS.map(m=>(
                <div key={m.id}
                  onClick={()=>{setView("modules");setOpenMod(m.id);}}
                  style={{background:"#0b0f0b",border:`1px solid ${m.color}18`,
                    borderLeft:`3px solid ${m.color}`,borderRadius:8,padding:"12px",
                    cursor:"pointer",transition:"all .2s"}}
                  onMouseOver={e=>e.currentTarget.style.borderLeftColor=m.color}
                  onMouseOut={e=>e.currentTarget.style.borderLeftColor=m.color}>
                  <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
                    <div style={{fontSize:22,width:38,height:38,display:"flex",
                      alignItems:"center",justifyContent:"center",
                      background:`${m.color}12`,border:`1px solid ${m.color}25`,borderRadius:7,flexShrink:0}}>
                      {m.icon}
                    </div>
                    <div>
                      <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,
                        fontSize:12,color:m.color,letterSpacing:1}}>MODULE {m.id}</div>
                      <div style={{fontSize:13,color:"#c0d4c0",fontWeight:600,marginTop:1}}>{m.title}</div>
                      <div style={{fontSize:10,color:"#2a5a2a",marginTop:2}}>{m.sub}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",
                    borderTop:`1px solid ${m.color}12`,paddingTop:8,marginTop:4}}>
                    <span style={{fontSize:10,color:"#3a7a3a"}}>{m.labs.length} labs</span>
                    <span style={{fontSize:10,color:m.color}}>Xem chi tiết →</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Learning Path */}
            <div style={{background:"#0b0f0b",border:"1px solid #4ade8012",
              borderRadius:8,padding:"12px 14px"}}>
              <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:12,
                color:"#4ade80",letterSpacing:1,marginBottom:10}}>🗺️ LỘ TRÌNH HỌC TẬP</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center"}}>
                {MODS.map((m,i)=>(
                  <div key={m.id} style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{background:`${m.color}15`,border:`1px solid ${m.color}35`,
                      borderRadius:6,padding:"5px 10px",fontSize:10,color:m.color}}>
                      {m.icon} {m.title}
                    </div>
                    {i<MODS.length-1 && <span style={{color:"#1a3a1a",fontSize:14}}>→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ MODULES & LABS ════════════════════ */}
        {view==="modules" && (
          <div className="fade">
            {MODS.map(mod=>{
              const modOpen = openMod===mod.id;
              return (
                <div key={mod.id} style={{marginBottom:8}}>
                  {/* Module Header */}
                  <div onClick={()=>{setOpenMod(modOpen?null:mod.id);setOpenLab(null);}}
                    style={{background:"#0c100c",
                      borderRadius:modOpen?"8px 8px 0 0":8,
                      border:`1px solid ${modOpen?mod.color:"#141e14"}`,
                      borderLeft:`4px solid ${mod.color}`,
                      padding:"12px 14px",cursor:"pointer",
                      display:"flex",alignItems:"center",gap:10}}>
                    <div style={{fontSize:20,width:36,height:36,display:"flex",
                      alignItems:"center",justifyContent:"center",
                      background:`${mod.color}12`,border:`1px solid ${mod.color}30`,
                      borderRadius:7,flexShrink:0}}>{mod.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                        <span style={{fontFamily:"Syne,sans-serif",fontWeight:800,
                          fontSize:11,color:mod.color,letterSpacing:2}}>MODULE {mod.id}</span>
                        <span style={{fontSize:10,color:"#2a5a2a"}}>{mod.labs.length} labs</span>
                      </div>
                      <div style={{fontSize:14,color:"#c8d8c8",fontWeight:600}}>{mod.title}</div>
                      <div style={{fontSize:10,color:"#2a4a2a",marginTop:2}}>{mod.sub}</div>
                    </div>
                    <div className="hide-sm" style={{display:"flex",flexWrap:"wrap",gap:4,maxWidth:200,justifyContent:"flex-end"}}>
                      {mod.labs.slice(0,4).map(l=>(
                        <span key={l.num} style={{background:`${mod.color}10`,
                          border:`1px solid ${mod.color}30`,borderRadius:4,
                          padding:"1px 6px",fontSize:9,color:mod.color}}>{l.name.split(" ")[0]}</span>
                      ))}
                    </div>
                    <span style={{color:mod.color,fontSize:12,flexShrink:0,marginLeft:6}}>
                      {modOpen?"▲":"▼"}
                    </span>
                  </div>

                  {/* Lab List */}
                  {modOpen && (
                    <div style={{background:"#08090d",
                      border:`1px solid ${mod.color}15`,
                      borderTop:"none",borderRadius:"0 0 8px 8px"}}>
                      {mod.labs.map(lab=>{
                        const labKey = `${mod.id}-${lab.num}`;
                        const labOpen = openLab===labKey;
                        const stars = "★".repeat(lab.diff) + "☆".repeat(4-lab.diff);

                        return (
                          <div key={lab.num}>
                            {/* Lab Row */}
                            <div onClick={()=>{setOpenLab(labOpen?null:labKey);setLabTab("theory");}}
                              style={{padding:"10px 14px",borderBottom:"1px solid #0e180e",
                                display:"flex",alignItems:"center",gap:8,cursor:"pointer",
                                background:labOpen?`${mod.color}06`:"transparent"}}>
                              <div style={{width:32,height:32,borderRadius:6,
                                background:`${mod.color}12`,border:`1px solid ${mod.color}30`,
                                display:"flex",alignItems:"center",justifyContent:"center",
                                fontSize:9,color:mod.color,flexShrink:0,fontWeight:700}}>
                                {lab.num}
                              </div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontSize:12,color:"#b8d0b8",fontWeight:600}}>{lab.name}</div>
                                <div style={{display:"flex",gap:12,marginTop:2}}>
                                  <span style={{fontSize:9,color:"#2a5a2a"}}>⏱ {lab.dur}</span>
                                  <span style={{fontSize:9,color:mod.color}}>{stars}</span>
                                  <span style={{fontSize:9,color:"#2a5a2a"}}>{lab.exercises.length} bài tập</span>
                                </div>
                              </div>
                              <span style={{color:"#1a4a1a",fontSize:10,flexShrink:0}}>
                                {labOpen?"▲":"▼"}
                              </span>
                            </div>

                            {/* Lab Content */}
                            {labOpen && (
                              <div className="fade" style={{padding:"12px 14px",
                                borderBottom:"1px solid #0e180e",background:"#060609"}}>

                                {/* Sub-tabs */}
                                <div style={{display:"flex",gap:4,marginBottom:10,flexWrap:"wrap"}}>
                                  {[["theory","💡 Lý Thuyết"],["steps","🔧 Hướng Dẫn"],
                                    ["code","💻 Code Mẫu"],["exercises","📝 Bài Tập"],
                                    ["results","✅ Kết Quả"],["hints","🎯 Hints"]].map(([k,l])=>(
                                    <button key={k}
                                      onClick={e=>{e.stopPropagation();setLabTab(k);}}
                                      style={{background:labTab===k?`${mod.color}18`:"#0d0f0d",
                                        border:`1px solid ${labTab===k?mod.color:"#181e18"}`,
                                        color:labTab===k?mod.color:"#2a5a2a",
                                        padding:"4px 9px",borderRadius:5,fontSize:9,
                                        whiteSpace:"nowrap"}}>
                                      {l}
                                    </button>
                                  ))}
                                </div>

                                {labTab==="theory" && (
                                  <div style={{background:`${mod.color}06`,
                                    border:`1px solid ${mod.color}18`,borderLeft:`3px solid ${mod.color}`,
                                    borderRadius:7,padding:"11px 13px"}}>
                                    <div style={{fontSize:9,color:mod.color,fontWeight:700,
                                      letterSpacing:1,marginBottom:6}}>📖 LÝ THUYẾT & KHÁI NIỆM</div>
                                    <p style={{fontSize:11,color:"#6a9a6a",lineHeight:1.9}}>{lab.theory}</p>
                                  </div>
                                )}

                                {labTab==="steps" && (
                                  <div>
                                    <div style={{fontSize:9,color:mod.color,fontWeight:700,
                                      letterSpacing:1,marginBottom:8}}>🔧 HƯỚNG DẪN TỪNG BƯỚC</div>
                                    {lab.steps.map((st,i)=>(
                                      <div key={i} style={{display:"flex",gap:8,marginBottom:7,
                                        alignItems:"flex-start"}}>
                                        <div style={{width:20,height:20,borderRadius:"50%",
                                          background:`${mod.color}15`,border:`1px solid ${mod.color}35`,
                                          display:"flex",alignItems:"center",justifyContent:"center",
                                          fontSize:8,color:mod.color,flexShrink:0,fontWeight:700}}>
                                          {i+1}
                                        </div>
                                        <span style={{fontSize:11,color:"#5a8a5a",lineHeight:1.8}}>{st}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {labTab==="code" && (
                                  <div>
                                    <div style={{fontSize:9,color:mod.color,fontWeight:700,
                                      letterSpacing:1,marginBottom:7}}>💻 CODE MẪU ĐẦY ĐỦ</div>
                                    <div style={{position:"relative"}}>
                                      <div style={{position:"absolute",top:8,right:10,
                                        display:"flex",gap:5,zIndex:1}}>
                                        {["#ff5f57","#febc2e","#28c840"].map(c=>(
                                          <div key={c} style={{width:9,height:9,borderRadius:"50%",background:c}}/>
                                        ))}
                                      </div>
                                      <pre style={{background:"#04050a",borderRadius:7,
                                        padding:"28px 12px 12px",fontSize:10,color:"#5ade80",
                                        lineHeight:1.85,overflowX:"auto",
                                        border:`1px solid ${mod.color}15`}}>
                                        {lab.code}
                                      </pre>
                                    </div>
                                  </div>
                                )}

                                {labTab==="exercises" && (
                                  <div>
                                    <div style={{fontSize:9,color:"#fbbf24",fontWeight:700,
                                      letterSpacing:1,marginBottom:8}}>📝 BÀI TẬP THỰC HÀNH</div>
                                    {lab.exercises.map((ex,i)=>(
                                      <div key={i} style={{display:"flex",gap:8,marginBottom:8,
                                        background:"#0c0f0c",border:"1px solid #151e15",
                                        borderRadius:6,padding:"9px 11px",alignItems:"flex-start"}}>
                                        <div style={{width:22,height:22,borderRadius:5,
                                          background:"#fbbf2415",border:"1px solid #fbbf2435",
                                          display:"flex",alignItems:"center",justifyContent:"center",
                                          fontSize:9,color:"#fbbf24",flexShrink:0,fontWeight:700}}>
                                          BT{i+1}
                                        </div>
                                        <span style={{fontSize:11,color:"#5a8a5a",lineHeight:1.75}}>{ex}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {labTab==="results" && (
                                  <div>
                                    <div style={{fontSize:9,color:"#4ade80",fontWeight:700,
                                      letterSpacing:1,marginBottom:7}}>✅ KẾT QUẢ CẦN ĐẠT ĐƯỢC</div>
                                    {lab.results.map((r,i)=>(
                                      <div key={i} style={{display:"flex",gap:7,marginBottom:6,
                                        background:"#060f06",border:"1px solid #0a1e0a",
                                        borderRadius:5,padding:"7px 9px"}}>
                                        <span style={{color:"#4ade80",fontSize:11,flexShrink:0}}>✓</span>
                                        <span style={{fontSize:11,color:"#4a8a4a"}}>{r}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {labTab==="hints" && (
                                  <div>
                                    <div style={{fontSize:9,color:"#60a5fa",fontWeight:700,
                                      letterSpacing:1,marginBottom:7}}>🎯 TIPS & COMMON MISTAKES</div>
                                    {lab.hints.map((h,i)=>(
                                      <div key={i} style={{display:"flex",gap:7,marginBottom:6,
                                        background:"#06080f",border:"1px solid #0a0f20",
                                        borderRadius:5,padding:"7px 9px"}}>
                                        <span style={{color:"#60a5fa",fontSize:10,flexShrink:0}}>💡</span>
                                        <span style={{fontSize:11,color:"#4a6a9a"}}>{h}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ══ QUICK REFERENCE ═══════════════════ */}
        {view==="ref" && (
          <div className="fade">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:8,marginBottom:10}}>
              {[
                {t:"🐍 Builtins Quan Trọng",c:"#4ade80",items:[
                  "len(), type(), id(), repr(), hash()",
                  "print(*args, sep=' ', end='\\n')",
                  "input(prompt) → str",
                  "range(stop) / range(start,stop,step)",
                  "enumerate(iter, start=0)",
                  "zip(*iterables) — song song",
                  "map(func, iter), filter(func, iter)",
                  "sorted(iter, key=None, reverse=False)",
                  "any(iter), all(iter), sum(), min(), max()",
                ]},
                {t:"📦 Collections Cheat Sheet",c:"#60a5fa",items:[
                  "list: mutable, ordered, O(n) search",
                  "dict: O(1) lookup, 3.7+ ordered",
                  "set: unordered, no duplicates, O(1)",
                  "tuple: immutable, faster than list",
                  "deque: O(1) appendleft/popleft",
                  "Counter: đếm; defaultdict: no KeyError",
                  "namedtuple: tuple có tên field",
                  "OrderedDict: giữ thứ tự (pre-3.7)",
                ]},
                {t:"🏛️ OOP Quick Ref",c:"#f472b6",items:[
                  "@property: getter/setter với validation",
                  "@classmethod(cls): factory method",
                  "@staticmethod: no self/cls",
                  "super().__init__(): gọi constructor cha",
                  "@abstractmethod: bắt buộc override",
                  "@dataclass: auto __init__/__repr__/__eq__",
                  "__slots__: giảm 30-50% RAM",
                  "isinstance(obj, cls) kể cả lớp con",
                ]},
                {t:"⚡ Performance Tips",c:"#fbbf24",items:[
                  "List comp nhanh hơn for loop ~30%",
                  "set/dict O(1) vs list O(n) lookup",
                  "' '.join(lst) thay string cộng",
                  "Generator cho data lớn (lazy)",
                  "@lru_cache: memoization tự động",
                  "__slots__: giảm RAM object",
                  "bisect: O(log n) trong sorted list",
                  "deque: O(1) thay list.insert(0,...)",
                ]},
                {t:"🔍 Debug Tools",c:"#fb923c",items:[
                  "print(type(x), repr(x), id(x))",
                  "breakpoint() / pdb.set_trace()",
                  "assert cond, 'message'",
                  "logging.debug/info/warning/error",
                  "traceback.print_exc()",
                  "vars(obj) / dir(obj) / help(obj)",
                  "dis.dis(func): xem bytecode",
                  "timeit.timeit('...', number=1000)",
                ]},
                {t:"🌐 Thư Viện Phổ Biến",c:"#a78bfa",items:[
                  "requests: HTTP client",
                  "pandas: data analysis",
                  "numpy: numerical computing",
                  "matplotlib/seaborn: visualization",
                  "fastapi/flask: web framework",
                  "pytest: testing framework",
                  "pydantic: data validation",
                  "sqlalchemy: ORM database",
                ]},
              ].map((card,i)=>(
                <div key={i} style={{background:"#0c100c",
                  border:`1px solid ${card.c}15`,borderLeft:`3px solid ${card.c}`,
                  borderRadius:7,padding:"11px 13px"}}>
                  <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,
                    fontSize:11,color:card.c,marginBottom:8,letterSpacing:1}}>{card.t}</div>
                  {card.items.map((item,j)=>(
                    <div key={j} style={{display:"flex",gap:5,marginBottom:4}}>
                      <span style={{color:card.c,fontSize:8,flexShrink:0,marginTop:3}}>▸</span>
                      <code style={{fontSize:9.5,color:"#4a7a4a",lineHeight:1.7,
                        fontFamily:"JetBrains Mono,monospace",wordBreak:"break-all"}}>{item}</code>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Exception Table */}
            <div style={{background:"#0c100c",border:"1px solid #1a1e1a",borderRadius:7,overflow:"hidden"}}>
              <div style={{background:"#08100a",padding:"8px 13px",
                borderBottom:"1px solid #161e16"}}>
                <span style={{fontFamily:"Syne,sans-serif",fontWeight:800,
                  fontSize:11,color:"#f472b6",letterSpacing:1}}>
                  ⚠️ COMMON EXCEPTIONS & FIX
                </span>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",minWidth:520}}>
                  <thead>
                    <tr style={{background:"#060a07"}}>
                      {["Exception","Nguyên Nhân","Cách Sửa"].map(h=>(
                        <th key={h} style={{padding:"6px 10px",textAlign:"left",
                          fontSize:9,color:"#2a5a2a",fontWeight:700,
                          borderBottom:"1px solid #141e14"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["TypeError","'1' + 1 — sai kiểu","int('1') + 1 — ép kiểu"],
                      ["ValueError","int('abc') — sai giá trị","try/except hoặc validate trước"],
                      ["IndexError","lst[99] list có 5 phần tử","Kiểm tra len() hoặc dùng get()"],
                      ["KeyError","d['key'] key không có","d.get('key', default)"],
                      ["AttributeError","None.upper() None không có method","Kiểm tra is not None"],
                      ["FileNotFoundError","open() file không tồn tại","Path.exists() hoặc try/except"],
                      ["ZeroDivisionError","1/0","Kiểm tra denominator != 0"],
                      ["RecursionError","Đệ quy quá sâu (>1000)","Tăng limit hoặc dùng iteration"],
                      ["StopIteration","next() generator đã hết","Dùng for loop hoặc default"],
                    ].map((row,i)=>(
                      <tr key={i} style={{borderBottom:"1px solid #0e160e",
                        background:i%2===0?"#0b0f0b":"#08090d"}}>
                        <td style={{padding:"6px 10px"}}>
                          <code style={{fontSize:9,color:"#f472b6",fontFamily:"JetBrains Mono,monospace"}}>{row[0]}</code>
                        </td>
                        <td style={{padding:"6px 10px",fontSize:9,color:"#3a6a3a"}}>{row[1]}</td>
                        <td style={{padding:"6px 10px",fontSize:9,color:"#4a8a4a"}}>{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── FOOTER ─────────────────────────── */}
      <footer style={{borderTop:"1px solid #0a1e0a",padding:"8px 14px",
        display:"flex",justifyContent:"space-between",alignItems:"center",
        fontSize:9,color:"#1a3a1a",flexWrap:"wrap",gap:4}}>
        <span>🐍 Python Lab · ĐH Đà Lạt</span>
        <span>GV: Vũ Minh Quan ·
          <a href="mailto:quanvm@dlu.edu.vn" style={{color:"#4ade80",marginLeft:4}}>quanvm@dlu.edu.vn</a>
        </span>
        <span className="hide-sm">{MODS.length} Modules · {totalLabs} Labs · {totalEx}+ Bài Tập</span>
      </footer>
    </div>
  );
}
