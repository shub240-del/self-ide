/* ExamForge question pack: conditions, while & for loops (Codeforces style). Generated; expected outputs come from running the reference solutions. */
window.EF_PACKS = (window.EF_PACKS || []).concat([{ id: "loops-v1", title: "Conditions, while and for loops", questions: [
{
"id": "loops-A1",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u4.s4",
"difficulty": "easy",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "A1 · Cinema Ticket",
"prompt": "A cinema prices tickets by age:\n- age below 5: free (0)\n- 5 to 12: 50\n- 13 to 59: 100\n- 60 and above: 60\n\nOn a weekend (`W`) every ticket that is **not free** costs 20 more. On a weekday (`D`) there is no surcharge.\n\nPrint the price.",
"inputFormat": "One line: an integer `age` and a character `d` (`W` or `D`).",
"outputFormat": "One integer — the ticket price.",
"constraints": "0 ≤ age ≤ 120",
"steps": [],
"sampleInput": "30 D",
"sampleOutput": "100",
"starter": "# read input with input(), print the answer\n",
"reference": "a, d = input().split()\na = int(a)\nif a < 5:\n    p = 0\nelif a <= 12:\n    p = 50\nelif a <= 59:\n    p = 100\nelse:\n    p = 60\nif d == \"W\" and p > 0:\n    p += 20\nprint(p)\n",
"hints": [
"Check the ranges from the smallest age upward with if / elif / else — each condition only needs the upper bound.",
"Boundary values (4, 5, 12, 13, 59, 60) are where students go wrong. Is 12 a child or an adult? Use <= deliberately.",
"Compute the base price first, then a separate `if d == \"W\" and price > 0:` adds 20 — so free tickets stay free."
],
"explanation": "Concepts: if-elif-else, boundaries, and/or",
"tests": [
{
"input": "30 D",
"expected": "100",
"category": "basic",
"hidden": false
},
{
"input": "4 W",
"expected": "0",
"category": "normal",
"hidden": false
},
{
"input": "60 W",
"expected": "80",
"category": "normal",
"hidden": false
},
{
"input": "5 D",
"expected": "50",
"category": "edge",
"hidden": true
},
{
"input": "12 W",
"expected": "70",
"category": "edge",
"hidden": true
},
{
"input": "13 D",
"expected": "100",
"category": "edge",
"hidden": true
},
{
"input": "59 W",
"expected": "120",
"category": "edge",
"hidden": true
},
{
"input": "60 D",
"expected": "60",
"category": "edge",
"hidden": true
},
{
"input": "0 W",
"expected": "0",
"category": "edge",
"hidden": true
},
{
"input": "120 W",
"expected": "80",
"category": "edge",
"hidden": true
},
{
"input": "4 D",
"expected": "0",
"category": "edge",
"hidden": true
},
{
"input": "11 D",
"expected": "50",
"category": "edge",
"hidden": true
},
{
"input": "100 D",
"expected": "60",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-A2",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u4.s5",
"difficulty": "easy",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "A2 · Triangle Detective",
"prompt": "Given three side lengths, decide what they form.\n\n- If they **cannot** form a triangle with positive area, print `Invalid`. (A triangle needs the sum of any two sides to be **strictly** greater than the third.)\n- Otherwise print `Equilateral` (all equal), `Isosceles` (exactly two equal) or `Scalene` (all different).",
"inputFormat": "One line: three integers a b c.",
"outputFormat": "One word.",
"constraints": "-10^9 ≤ a, b, c ≤ 10^9 (they may be zero or negative!)",
"steps": [],
"sampleInput": "3 4 5",
"sampleOutput": "Scalene",
"starter": "# read input with input(), print the answer\n",
"reference": "a, b, c = map(int, input().split())\nif a <= 0 or b <= 0 or c <= 0 or a + b <= c or a + c <= b or b + c <= a:\n    print(\"Invalid\")\nelif a == b == c:\n    print(\"Equilateral\")\nelif a == b or b == c or a == c:\n    print(\"Isosceles\")\nelse:\n    print(\"Scalene\")\n",
"hints": [
"First rule out everything that is not a triangle — only then classify it.",
"Degenerate cases: 1 2 3 has 1 + 2 = 3, a flat line with zero area. Use <= in the invalid test. And what about zero or negative sides?",
"For Isosceles you must compare all three pairs: a == b or b == c or a == c."
],
"explanation": "Concepts: nested conditions, edge cases, logical operators",
"tests": [
{
"input": "3 4 5",
"expected": "Scalene",
"category": "basic",
"hidden": false
},
{
"input": "2 2 3",
"expected": "Isosceles",
"category": "normal",
"hidden": false
},
{
"input": "1 2 3",
"expected": "Invalid",
"category": "normal",
"hidden": false
},
{
"input": "5 5 5",
"expected": "Equilateral",
"category": "edge",
"hidden": true
},
{
"input": "0 0 0",
"expected": "Invalid",
"category": "edge",
"hidden": true
},
{
"input": "-3 4 5",
"expected": "Invalid",
"category": "edge",
"hidden": true
},
{
"input": "7 3 7",
"expected": "Isosceles",
"category": "edge",
"hidden": true
},
{
"input": "3 7 3",
"expected": "Invalid",
"category": "edge",
"hidden": true
},
{
"input": "1 1 2",
"expected": "Invalid",
"category": "edge",
"hidden": true
},
{
"input": "10 1 1",
"expected": "Invalid",
"category": "edge",
"hidden": true
},
{
"input": "1000000000 1000000000 1",
"expected": "Isosceles",
"category": "edge",
"hidden": true
},
{
"input": "6 8 10",
"expected": "Scalene",
"category": "edge",
"hidden": true
},
{
"input": "2 3 2",
"expected": "Isosceles",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-A3",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u3.s1",
"difficulty": "medium",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "A3 · Days in the Month",
"prompt": "Print the number of days in month `m` of year `y` (Gregorian calendar).\n\nA year is a leap year if it is divisible by 400, **or** divisible by 4 but **not** by 100. February has 29 days in a leap year and 28 otherwise. April, June, September and November have 30 days; the rest have 31.",
"inputFormat": "One line: two integers y m.",
"outputFormat": "One integer.",
"constraints": "1 ≤ y ≤ 10^9, 1 ≤ m ≤ 12",
"steps": [],
"sampleInput": "2024 2",
"sampleOutput": "29",
"starter": "# read input with input(), print the answer\n",
"reference": "y, m = map(int, input().split())\nif m == 2:\n    leap = (y % 4 == 0 and y % 100 != 0) or y % 400 == 0\n    print(29 if leap else 28)\nelif m in (4, 6, 9, 11):\n    print(30)\nelse:\n    print(31)\n",
"hints": [
"Handle February separately; for the other months only the month number matters.",
"Write the leap-year rule as one boolean: (y % 4 == 0 and y % 100 != 0) or y % 400 == 0.",
"Test 1900 (not leap) and 2000 (leap) by hand — they are exactly the traps the judge checks."
],
"explanation": "Concepts: boolean logic, precedence, leap year",
"tests": [
{
"input": "2024 2",
"expected": "29",
"category": "basic",
"hidden": false
},
{
"input": "2023 2",
"expected": "28",
"category": "normal",
"hidden": false
},
{
"input": "2026 11",
"expected": "30",
"category": "normal",
"hidden": false
},
{
"input": "1900 2",
"expected": "28",
"category": "edge",
"hidden": true
},
{
"input": "2000 2",
"expected": "29",
"category": "edge",
"hidden": true
},
{
"input": "2100 2",
"expected": "28",
"category": "edge",
"hidden": true
},
{
"input": "2400 2",
"expected": "29",
"category": "edge",
"hidden": true
},
{
"input": "4 2",
"expected": "29",
"category": "edge",
"hidden": true
},
{
"input": "1 1",
"expected": "31",
"category": "edge",
"hidden": true
},
{
"input": "2026 12",
"expected": "31",
"category": "edge",
"hidden": true
},
{
"input": "2026 4",
"expected": "30",
"category": "edge",
"hidden": true
},
{
"input": "1000000000 2",
"expected": "29",
"category": "edge",
"hidden": true
},
{
"input": "999999996 2",
"expected": "29",
"category": "edge",
"hidden": true
},
{
"input": "7 9",
"expected": "30",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-A4",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u2.s3",
"difficulty": "easy",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "A4 · School Trip Buses",
"prompt": "`n` students go on a trip. Each bus holds at most `k` students and costs `c` rupees. Print the minimum number of buses and the total cost.\n\nYou may **not** import `math` — use integer arithmetic only.",
"inputFormat": "One line: n k c.",
"outputFormat": "Two integers: buses and total cost.",
"constraints": "0 ≤ n ≤ 10^18, 1 ≤ k ≤ 10^18, 1 ≤ c ≤ 10^9",
"steps": [],
"sampleInput": "45 40 1500",
"sampleOutput": "2 3000",
"starter": "# read input with input(), print the answer\n",
"reference": "n, k, c = map(int, input().split())\nb = (n + k - 1) // k\nprint(b, b * c)\n",
"hints": [
"You need ceil(n / k) buses. Floor division alone undercounts when there is a remainder.",
"Integer ceiling trick: (n + k - 1) // k. Check it for n = 80, k = 40 and for n = 0.",
"Avoid float division (n / k): at 10^18 floats lose precision."
],
"explanation": "Concepts: ceil division, // and %, edge case 0",
"tests": [
{
"input": "45 40 1500",
"expected": "2 3000",
"category": "basic",
"hidden": false
},
{
"input": "80 40 1500",
"expected": "2 3000",
"category": "normal",
"hidden": false
},
{
"input": "0 50 100",
"expected": "0 0",
"category": "normal",
"hidden": false
},
{
"input": "1 1 1",
"expected": "1 1",
"category": "edge",
"hidden": true
},
{
"input": "39 40 10",
"expected": "1 10",
"category": "edge",
"hidden": true
},
{
"input": "41 40 10",
"expected": "2 20",
"category": "edge",
"hidden": true
},
{
"input": "1000000000000000000 3 1000000000",
"expected": "333333333333333334 333333333333333334000000000",
"category": "edge",
"hidden": true
},
{
"input": "999999999999999999 1000000000000000000 7",
"expected": "1 7",
"category": "edge",
"hidden": true
},
{
"input": "7 1 5",
"expected": "7 35",
"category": "edge",
"hidden": true
},
{
"input": "100 7 3",
"expected": "15 45",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-A5",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u4.s4",
"difficulty": "easy",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "A5 · Odd One Out",
"prompt": "Three friends each say a number. Exactly two of them said the same number and one said something different. Print the position (1, 2 or 3) of the friend who is different.",
"inputFormat": "One line: three integers a b c.",
"outputFormat": "One integer: 1, 2 or 3.",
"constraints": "-10^9 ≤ a, b, c ≤ 10^9; exactly two are equal.",
"steps": [],
"sampleInput": "4 4 7",
"sampleOutput": "3",
"starter": "# read input with input(), print the answer\n",
"reference": "a, b, c = map(int, input().split())\nif a == b:\n    print(3)\nelif a == c:\n    print(2)\nelse:\n    print(1)\n",
"hints": [
"If two numbers are equal, the odd one is the remaining position.",
"Compare a with b first. If they match, it's 3. Otherwise one of a or b is the odd one — compare a with c to decide.",
"Careful: `a != b` alone doesn't tell you whether a or b is the odd one."
],
"explanation": "Concepts: conditions, comparisons",
"tests": [
{
"input": "4 4 7",
"expected": "3",
"category": "basic",
"hidden": false
},
{
"input": "9 2 9",
"expected": "2",
"category": "normal",
"hidden": false
},
{
"input": "5 1 1",
"expected": "1",
"category": "normal",
"hidden": false
},
{
"input": "-1 -1 0",
"expected": "3",
"category": "edge",
"hidden": true
},
{
"input": "0 -5 0",
"expected": "2",
"category": "edge",
"hidden": true
},
{
"input": "8 3 3",
"expected": "1",
"category": "edge",
"hidden": true
},
{
"input": "1000000000 -1000000000 -1000000000",
"expected": "1",
"category": "edge",
"hidden": true
},
{
"input": "2 2 -2",
"expected": "3",
"category": "edge",
"hidden": true
},
{
"input": "7 6 7",
"expected": "2",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-B1",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u5.s1",
"difficulty": "easy",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "B1 · Collatz Steps",
"prompt": "Start from `n`. While `n` is not 1: if `n` is even, divide it by 2; otherwise replace it by `3n + 1`. Print how many steps it takes to reach 1.",
"inputFormat": "One integer n.",
"outputFormat": "One integer — the number of steps.",
"constraints": "1 ≤ n ≤ 10^6",
"steps": [],
"sampleInput": "6",
"sampleOutput": "8",
"starter": "# read input with input(), print the answer\n",
"reference": "n = int(input())\ns = 0\nwhile n != 1:\n    if n % 2 == 0:\n        n //= 2\n    else:\n        n = 3 * n + 1\n    s += 1\nprint(s)\n",
"hints": [
"The four parts: initialise a step counter at 0, loop while n != 1, update n, count the step.",
"Use n //= 2, not n / 2 — the plain slash turns n into a float.",
"n = 1 needs 0 steps: the condition is false on the very first check."
],
"explanation": "Concepts: while loop, counter, parity",
"tests": [
{
"input": "6",
"expected": "8",
"category": "basic",
"hidden": false
},
{
"input": "1",
"expected": "0",
"category": "normal",
"hidden": false
},
{
"input": "27",
"expected": "111",
"category": "normal",
"hidden": false
},
{
"input": "2",
"expected": "1",
"category": "edge",
"hidden": true
},
{
"input": "3",
"expected": "7",
"category": "edge",
"hidden": true
},
{
"input": "7",
"expected": "16",
"category": "edge",
"hidden": true
},
{
"input": "97",
"expected": "118",
"category": "edge",
"hidden": true
},
{
"input": "837799",
"expected": "524",
"category": "edge",
"hidden": true
},
{
"input": "1000000",
"expected": "152",
"category": "edge",
"hidden": true
},
{
"input": "999999",
"expected": "258",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-B2",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u5.s3",
"difficulty": "medium",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "B2 · Digit Report",
"prompt": "For a non-negative integer `n`, print four things on one line:\n1. the number of digits,\n2. the sum of the digits,\n3. the number written backwards (leading zeros dropped),\n4. `YES` if `n` is a palindrome, else `NO`.\n\nSolve it with `%` and `//` in a while loop — no `str()` allowed in spirit!",
"inputFormat": "One integer n.",
"outputFormat": "Four values separated by spaces.",
"constraints": "0 ≤ n ≤ 10^18",
"steps": [],
"sampleInput": "4827",
"sampleOutput": "4 21 7284 NO",
"starter": "# read input with input(), print the answer\n",
"reference": "n = int(input())\nif n == 0:\n    print(1, 0, 0, \"YES\")\nelse:\n    m = n\n    cnt = 0\n    s = 0\n    rev = 0\n    while m > 0:\n        d = m % 10\n        cnt += 1\n        s += d\n        rev = rev * 10 + d\n        m //= 10\n    print(cnt, s, rev, \"YES\" if rev == n else \"NO\")\n",
"hints": [
"The digit loop is: d = m % 10 (take a digit) and m //= 10 (drop it). Run it on a copy so you can still compare with n.",
"One loop, three accumulators: count += 1, total += d, rev = rev * 10 + d.",
"while m > 0 never runs for n = 0 — but 0 has 1 digit. Handle it separately."
],
"explanation": "Concepts: while loop, % and //, accumulator, edge case 0",
"tests": [
{
"input": "4827",
"expected": "4 21 7284 NO",
"category": "basic",
"hidden": false
},
{
"input": "1200",
"expected": "4 3 21 NO",
"category": "normal",
"hidden": false
},
{
"input": "0",
"expected": "1 0 0 YES",
"category": "normal",
"hidden": false
},
{
"input": "7",
"expected": "1 7 7 YES",
"category": "edge",
"hidden": true
},
{
"input": "121",
"expected": "3 4 121 YES",
"category": "edge",
"hidden": true
},
{
"input": "10",
"expected": "2 1 1 NO",
"category": "edge",
"hidden": true
},
{
"input": "1000000000000000000",
"expected": "19 1 1 NO",
"category": "edge",
"hidden": true
},
{
"input": "123454321",
"expected": "9 25 123454321 YES",
"category": "edge",
"hidden": true
},
{
"input": "999999999999999999",
"expected": "18 162 999999999999999999 YES",
"category": "edge",
"hidden": true
},
{
"input": "98089",
"expected": "5 34 98089 YES",
"category": "edge",
"hidden": true
},
{
"input": "100001",
"expected": "6 2 100001 YES",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-B3",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u5.s6",
"difficulty": "medium",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "B3 · Sentinel Statistics",
"prompt": "Numbers arrive one per line. The input ends with a line containing `0` (the sentinel), which is **not** part of the data.\n\nPrint the count, the sum and the maximum of the data. If there is no data before the `0`, print `EMPTY`.",
"inputFormat": "Integers, one per line, ending with 0.",
"outputFormat": "count sum max, or EMPTY.",
"constraints": "At most 10^5 numbers before the 0; each is non-zero with |x| ≤ 10^9.",
"steps": [],
"sampleInput": "5\n-2\n9\n0",
"sampleOutput": "3 12 9",
"starter": "# read input with input(), print the answer\n",
"reference": "cnt = 0\ns = 0\nmx = None\nwhile True:\n    x = int(input())\n    if x == 0:\n        break\n    cnt += 1\n    s += x\n    if mx is None or x > mx:\n        mx = x\nif cnt == 0:\n    print(\"EMPTY\")\nelse:\n    print(cnt, s, mx)\n",
"hints": [
"The loop condition is True; the only exit is `break` when you read the sentinel 0.",
"Read, check for the sentinel, then update count, sum and max — in that order, so 0 never gets counted.",
"Starting max at 0 is a trap when every number is negative. Start it at None (or at the first number)."
],
"explanation": "Concepts: while True, break, sentinel, max with negatives",
"tests": [
{
"input": "5\n-2\n9\n0",
"expected": "3 12 9",
"category": "basic",
"hidden": false
},
{
"input": "0",
"expected": "EMPTY",
"category": "normal",
"hidden": false
},
{
"input": "-7\n-3\n0",
"expected": "2 -10 -3",
"category": "normal",
"hidden": false
},
{
"input": "-1\n0",
"expected": "1 -1 -1",
"category": "edge",
"hidden": true
},
{
"input": "1000000000\n1000000000\n0",
"expected": "2 2000000000 1000000000",
"category": "edge",
"hidden": true
},
{
"input": "4\n0\n",
"expected": "1 4 4",
"category": "edge",
"hidden": true
},
{
"input": "-5\n-5\n-5\n0",
"expected": "3 -15 -5",
"category": "edge",
"hidden": true
},
{
"input": "-343043869\n-949316403\n-960791841\n841140766\n806407984\n257627257\n-659496828\n-118902462\n876990828\n-482813205\n-874844774\n729488325\n225727009\n270060144\n997846852\n864508089\n800979099\n-776435575\n96277025\n308810232\n151277719\n26563622\n390350504\n453352587\n-428179594\n931176057\n-456816282\n427508602\n906751037\n605590521\n550775248\n-617955857\n-822299758\n-878462768\n-756625750\n-770203092\n504701958\n-517665010\n-912281943\n-672882331\n724027512\n767213566\n601076436\n719142806\n588570008\n864248674\n465001975\n-316081830\n9960992\n-160893499\n862801955\n386478188\n-279291541\n501068182\n867539666\n598973997\n-892712095\n340007978\n984419062\n-470783220\n486319899\n-457174077\n69036397\n969871995\n397422745\n-208935784\n157151434\n984063662\n-98965314\n-484504870\n-655126093\n-266113610\n-666873847\n-807298166\n717771849\n166173261\n-336556571\n740620526\n-586052165\n-507862198\n-642244083\n90659471\n717855329\n-145326802\n545140755\n419196656\n-558378948\n-403733572\n-113960452\n953236593\n-55163881\n693929755\n826280555\n-27468773\n351929678\n483334558\n981353762\n-534261375\n613770387\n-165238757\n-465582578\n492651275\n-728532006\n-587716834\n36671170\n-694958410\n-48572422\n-485138952\n-519520086\n-138662777\n-843326435\n-172218180\n-418728645\n456720676\n932057241\n-411442131\n201003166\n187577280\n498125209\n837784965\n308883593\n190011801\n557631829\n477367253\n-566132361\n876336910\n-910393423\n-248393870\n-99986404\n693292769\n438089307\n-29189428\n908965719\n-377636854\n-117782501\n596785443\n-611855695\n604335601\n719737049\n-108937269\n103541718\n183905225\n-735027063\n-815091095\n775626332\n-693577508\n-543986280\n297196779\n-312497686\n173292140\n275011140\n-14893375\n930390331\n445096324\n-61537875\n-252571329\n-332772644\n-100792300\n338201223\n652035157\n-992936270\n339370844\n-637864325\n457547121\n-737084530\n924814664\n417736367\n877049128\n61880505\n943193539\n-302184163\n310908059\n-318839065\n342397500\n-582136466\n212008492\n-774896095\n-174079472\n-127005354\n-134949975\n640972994\n30917512\n620759306\n-382221434\n412430589\n256952840\n711453850\n-832050879\n-196996318\n-710347523\n954713334\n844610677\n-245087797\n-17819607\n581055367\n448694989\n337954539\n-672997488\n-901463488\n-593760026\n-698161139\n365837810\n60404144\n-674157556\n-505243915\n-238197459\n-995605217\n759424924\n848431825\n-603002921\n369032123\n-402359539\n493134966\n589264694\n963170335\n201758533\n-674327684\n165119631\n959707972\n-380568767\n854018131\n-686245922\n-90416915\n400284364\n148134052\n-970132570\n-572750587\n-912478247\n614856071\n-422276923\n578726399\n-546278473\n-91844357\n-786597409\n358210952\n333310703\n-791702094\n-174172363\n317067203\n383565618\n-417268839\n-802088026\n-909791166\n453820100\n872016139\n-775220322\n-192868845\n578850370\n-176027086\n-952615634\n-552968672\n-903997242\n68290431\n324966658\n-571372477\n-643704381\n-135854609\n-350352552\n115312911\n-409308854\n662450040\n695296771\n-373446405\n976567650\n129856864\n-889748817\n733939086\n985360267\n88636821\n-836494404\n-868033335\n835329517\n284867998\n-180755334\n464497087\n346489640\n432792427\n189776637\n-865841451\n236406566\n814782452\n439911936\n228573375\n-474241460\n-463100114\n353232606\n-343634489\n903210260\n283062975\n-585314851\n251570088\n154044220\n-287666199\n616744878\n679884648\n428906502\n-590272549\n723827515\n361676064\n-729258549\n975539303\n-455735052\n696026681\n64458212\n777857321\n-11290846\n600137341\n140229814\n621644350\n894343087\n914109949\n363726336\n-40260562\n-683189854\n-709396036\n350698763\n-837271957\n-849055731\n552914282\n668753988\n84812673\n-578705201\n-102641712\n-354317052\n-497640580\n-650775673\n-757541913\n90497301\n764320497\n-116024130\n-290849469\n47759042\n-590807484\n-977600055\n706398683\n368892714\n341254794\n274179533\n948393582\n900827228\n39422927\n143059250\n-516125121\n272572359\n213389116\n293813122\n326490074\n-624642011\n-875034789\n926567930\n-779419381\n518184809\n-915955224\n525311625\n709268876\n386632202\n-83824828\n-815317396\n935800438\n677038637\n-993752860\n-31005179\n258659375\n-460622442\n-551561307\n-850061491\n832992636\n146792204\n390569024\n571985371\n-163201015\n-782480859\n-140935790\n-860983123\n-301041974\n880099564\n-149452713\n580163321\n137427574\n180704534\n-744082708\n-806765077\n-730065351\n-444440229\n979661155\n-322818522\n-552523334\n953509954\n-499976983\n166449240\n156386077\n-505557705\n-62458708\n-379058831\n353015902\n-175890093\n-933176312\n-454021161\n214142430\n-258901478\n0",
"expected": "400 12593388142 997846852",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-B4",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u5.s1",
"difficulty": "medium",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "B4 · Smallest Divisor",
"prompt": "For an integer `n`, print `PRIME` if it is prime. If `n` is 1, print `NEITHER`. Otherwise print its smallest divisor greater than 1.\n\n`n` can be as large as 10^12, so checking every number up to `n` is far too slow.",
"inputFormat": "One integer n.",
"outputFormat": "PRIME, NEITHER, or one integer.",
"constraints": "1 ≤ n ≤ 10^12",
"steps": [],
"sampleInput": "91",
"sampleOutput": "7",
"starter": "# read input with input(), print the answer\n",
"reference": "n = int(input())\nif n == 1:\n    print(\"NEITHER\")\nelse:\n    d = 2\n    found = 0\n    while d * d <= n:\n        if n % d == 0:\n            found = d\n            break\n        d += 1\n    print(found if found else \"PRIME\")\n",
"hints": [
"Use a flag (or remember the divisor) and break as soon as you find one.",
"If n has a divisor, it has one ≤ √n. Loop while d * d <= n — this makes 10^12 take about 10^6 steps.",
"Test perfect squares like 49 = 7 × 7: with `d * d < n` you would miss 7. And n = 1 is neither prime nor composite."
],
"explanation": "Concepts: while loop, flag/break, i*i <= n optimisation, edge case 1",
"tests": [
{
"input": "91",
"expected": "7",
"category": "basic",
"hidden": false
},
{
"input": "13",
"expected": "PRIME",
"category": "normal",
"hidden": false
},
{
"input": "1",
"expected": "NEITHER",
"category": "normal",
"hidden": false
},
{
"input": "2",
"expected": "PRIME",
"category": "edge",
"hidden": true
},
{
"input": "4",
"expected": "2",
"category": "edge",
"hidden": true
},
{
"input": "9",
"expected": "3",
"category": "edge",
"hidden": true
},
{
"input": "25",
"expected": "5",
"category": "edge",
"hidden": true
},
{
"input": "49",
"expected": "7",
"category": "edge",
"hidden": true
},
{
"input": "999999999989",
"expected": "PRIME",
"category": "edge",
"hidden": true
},
{
"input": "1000000000000",
"expected": "2",
"category": "edge",
"hidden": true
},
{
"input": "999966000289",
"expected": "999983",
"category": "edge",
"hidden": true
},
{
"input": "97",
"expected": "PRIME",
"category": "edge",
"hidden": true
},
{
"input": "100",
"expected": "2",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-B5",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u5.s4",
"difficulty": "medium",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "B5 · Euclid's Race",
"prompt": "For two positive integers `a` and `b`, print their GCD, their LCM, and the number of `%` operations Euclid's algorithm performs (each pass of `a, b = b, a % b` while `b != 0` counts as one).",
"inputFormat": "One line: a b.",
"outputFormat": "gcd lcm steps",
"constraints": "1 ≤ a, b ≤ 10^18",
"steps": [],
"sampleInput": "48 18",
"sampleOutput": "6 144 3",
"starter": "# read input with input(), print the answer\n",
"reference": "a, b = map(int, input().split())\nx, y = a, b\nsteps = 0\nwhile y != 0:\n    x, y = y, x % y\n    steps += 1\nprint(x, a // x * b, steps)\n",
"hints": [
"Euclid: while b != 0: a, b = b, a % b. When it stops, a is the GCD.",
"Keep the original a and b — you need them for lcm = a // g * b (divide first to keep numbers small).",
"Brute force up to min(a, b) times out at 10^18. Count one step per loop pass."
],
"explanation": "Concepts: while loop, GCD, LCM, Euclid",
"tests": [
{
"input": "48 18",
"expected": "6 144 3",
"category": "basic",
"hidden": false
},
{
"input": "7 5",
"expected": "1 35 3",
"category": "normal",
"hidden": false
},
{
"input": "10 10",
"expected": "10 10 1",
"category": "normal",
"hidden": false
},
{
"input": "1 1",
"expected": "1 1 1",
"category": "edge",
"hidden": true
},
{
"input": "1 1000000000000000000",
"expected": "1 1000000000000000000 2",
"category": "edge",
"hidden": true
},
{
"input": "1000000000000000000 999999999999999999",
"expected": "1 999999999999999999000000000000000000 2",
"category": "edge",
"hidden": true
},
{
"input": "832040 514229",
"expected": "1 427859097160 28",
"category": "edge",
"hidden": true
},
{
"input": "12 18",
"expected": "6 36 3",
"category": "edge",
"hidden": true
},
{
"input": "18 12",
"expected": "6 36 2",
"category": "edge",
"hidden": true
},
{
"input": "6 3",
"expected": "3 6 1",
"category": "edge",
"hidden": true
},
{
"input": "3 6",
"expected": "3 6 2",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-B6",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u5.s2",
"difficulty": "medium",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "B6 · Savings Goal",
"prompt": "You have `p` rupees in a bank. At the end of every year the bank adds `p * r // 100` rupees interest (rounded down). How many years until you have **at least** `t` rupees?\n\nIf you will never reach `t`, print `-1`.",
"inputFormat": "One line: p r t.",
"outputFormat": "One integer.",
"constraints": "1 ≤ p ≤ 10^9, 0 ≤ r ≤ 100, 1 ≤ t ≤ 10^9",
"steps": [],
"sampleInput": "100 10 150",
"sampleOutput": "5",
"starter": "# read input with input(), print the answer\n",
"reference": "p, r, t = map(int, input().split())\nyears = 0\nwhile p < t:\n    gain = p * r // 100\n    if gain == 0:\n        years = -1\n        break\n    p += gain\n    years += 1\nprint(years)\n",
"hints": [
"The loop runs while p < t; each pass adds the interest and counts a year.",
"If p already meets t, the answer is 0 — your loop must not run at all.",
"If the interest p * r // 100 is 0 (r = 0, or p tiny), p never grows: that's an infinite loop. Detect it and print -1."
],
"explanation": "Concepts: while loop, accumulator, infinite-loop trap",
"tests": [
{
"input": "100 10 150",
"expected": "5",
"category": "basic",
"hidden": false
},
{
"input": "500 5 100",
"expected": "0",
"category": "normal",
"hidden": false
},
{
"input": "5 10 100",
"expected": "-1",
"category": "normal",
"hidden": false
},
{
"input": "100 0 101",
"expected": "-1",
"category": "edge",
"hidden": true
},
{
"input": "1 100 1000000000",
"expected": "30",
"category": "edge",
"hidden": true
},
{
"input": "1000000000 1 1000000000",
"expected": "0",
"category": "edge",
"hidden": true
},
{
"input": "99 1 1000",
"expected": "-1",
"category": "edge",
"hidden": true
},
{
"input": "100 1 1000",
"expected": "284",
"category": "edge",
"hidden": true
},
{
"input": "1 1 2",
"expected": "-1",
"category": "edge",
"hidden": true
},
{
"input": "50 100 51",
"expected": "1",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-C1",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u5.s1",
"difficulty": "easy",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "C1 · Range Walker",
"prompt": "Print every number from `a` to `b` **inclusive**, stepping by `k`. The step may be negative. If no number is printed, print `EMPTY`.\n\n(`k` is never 0.)",
"inputFormat": "One line: a b k.",
"outputFormat": "The numbers separated by spaces, or EMPTY.",
"constraints": "-1000 ≤ a, b ≤ 1000, 1 ≤ |k| ≤ 1000",
"steps": [],
"sampleInput": "1 10 3",
"sampleOutput": "1 4 7 10",
"starter": "# read input with input(), print the answer\n",
"reference": "a, b, k = map(int, input().split())\nstop = b + 1 if k > 0 else b - 1\nnums = [str(x) for x in range(a, stop, k)]\nprint(\" \".join(nums) if nums else \"EMPTY\")\n",
"hints": [
"range(start, stop, step) never includes stop — so to include b you must go one step past it.",
"Going up you stop at b + 1; going down (negative k) you stop at b - 1.",
"Collect the numbers in a list; if it's empty print EMPTY, otherwise join with spaces."
],
"explanation": "Concepts: for, range(start, stop, step), negative step",
"tests": [
{
"input": "1 10 3",
"expected": "1 4 7 10",
"category": "basic",
"hidden": false
},
{
"input": "10 1 -4",
"expected": "10 6 2",
"category": "normal",
"hidden": false
},
{
"input": "5 1 2",
"expected": "EMPTY",
"category": "normal",
"hidden": false
},
{
"input": "3 3 1",
"expected": "3",
"category": "edge",
"hidden": true
},
{
"input": "3 3 -1",
"expected": "3",
"category": "edge",
"hidden": true
},
{
"input": "-5 5 5",
"expected": "-5 0 5",
"category": "edge",
"hidden": true
},
{
"input": "0 -10 -3",
"expected": "0 -3 -6 -9",
"category": "edge",
"hidden": true
},
{
"input": "1 2 1000",
"expected": "1",
"category": "edge",
"hidden": true
},
{
"input": "1000 -1000 -1000",
"expected": "1000 0 -1000",
"category": "edge",
"hidden": true
},
{
"input": "-1 -1 7",
"expected": "-1",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-C2",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u5.s1",
"difficulty": "easy",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "C2 · Skip the Unlucky",
"prompt": "Print all numbers from 1 to `n` on one line, **skipping** every number that is divisible by `x` or that contains the digit `d`. If every number is skipped, print `-1`.",
"inputFormat": "One line: n x d.",
"outputFormat": "Numbers separated by spaces, or -1.",
"constraints": "1 ≤ n ≤ 10^4, 1 ≤ x ≤ 10^4, 0 ≤ d ≤ 9",
"steps": [],
"sampleInput": "15 4 3",
"sampleOutput": "1 2 5 6 7 9 10 11 14 15",
"starter": "# read input with input(), print the answer\n",
"reference": "n, x, d = map(int, input().split())\nout = []\nfor i in range(1, n + 1):\n    if i % x == 0:\n        continue\n    m = i\n    has = False\n    while m > 0:\n        if m % 10 == d:\n            has = True\n            break\n        m //= 10\n    if has:\n        continue\n    out.append(str(i))\nprint(\" \".join(out) if out else -1)\n",
"hints": [
"Use continue to jump straight to the next number as soon as a rule says skip.",
"Checking for digit d: pull digits with % 10 and // 10 in a small while loop (or compare as strings).",
"range(1, n + 1) — don't drop n. And remember to print -1 when the list is empty."
],
"explanation": "Concepts: for, continue, digit check",
"tests": [
{
"input": "15 4 3",
"expected": "1 2 5 6 7 9 10 11 14 15",
"category": "basic",
"hidden": false
},
{
"input": "5 1 7",
"expected": "-1",
"category": "normal",
"hidden": false
},
{
"input": "12 100 1",
"expected": "2 3 4 5 6 7 8 9",
"category": "normal",
"hidden": false
},
{
"input": "1 2 1",
"expected": "-1",
"category": "edge",
"hidden": true
},
{
"input": "20 3 0",
"expected": "1 2 4 5 7 8 11 13 14 16 17 19",
"category": "edge",
"hidden": true
},
{
"input": "100 7 7",
"expected": "1 2 3 4 5 6 8 9 10 11 12 13 15 16 18 19 20 22 23 24 25 26 29 30 31 32 33 34 36 38 39 40 41 43 44 45 46 48 50 51 52 53 54 55 58 59 60 61 62 64 65 66 68 69 80 81 82 83 85 86 88 89 90 92 93 94 95 96 99 100",
"category": "edge",
"hidden": true
},
{
"input": "10000 9 9",
"expected": "1 2 3 4 5 6 7 8 10 11 12 13 14 15 16 17 20 21 22 23 24 25 26 28 30 31 32 33 34 35 37 38 40 41 42 43 44 46 47 48 50 51 52 53 55 56 57 58 60 61 62 64 65 66 67 68 70 71 73 74 75 76 77 78 80 82 83 84 85 86 87 88 100 101 102 103 104 105 106 107 110 111 112 113 114 115 116 118 120 121 122 123 124 125 127 128 130 131 132 133 134 136 137 138 140 141 142 143 145 146 147 148 150 151 152 154 155 156 157 158 160 161 163 164 165 166 167 168 170 172 173 174 175 176 177 178 181 182 183 184 185 186 187 188 200 201 202 203 204 205 206 208 210 211 212 213 214 215 217 218 220 221 222 223 224 226 227 228 230 231 232 233 235 236 237 238 240 241 242 244 245 246 247 248 250 251 253 254 255 256 257 258 260 262 263 264 265 266 267 268 271 272 273 274 275 276 277 278 280 281 282 283 284 285 286 287 300 301 302 303 304 305 307 308 310 311 312 313 314 316 317 318 320 321 322 323 325 326 327 328 330 331 332 334 335 336 337 338 340 341 343 344 345 346 347 348 350 352 353 354 355 356 357 358 361 362 363 364 365 366 367 368 370 371 372 373 374 375 376 377 380 381 382 383 384 385 386 388 400 401 402 403 404 406 407 408 410 411 412 413 415 416 417 418 420 421 422 424 425 426 427 428 430 431 433 434 435 436 437 438 440 442 443 444 445 446 447 448 451 452 453 454 455 456 457 458 460 461 462 463 464 465 466 467 470 471 472 473 474 475 476 478 480 481 482 483 484 485 487 488 500 501 502 503 505 506 507 508 510 511 512 514 515 516 517 518 520 521 523 524 525 526 527 528 530 532 533 534 535 536 537 538 541 542 543 544 545 546 547 548 550 551 552 553 554 555 556 557 560 561 562 563 564 565 566 568 570 571 572 573 574 575 577 578 580 581 582 583 584 586 587 588 600 601 602 604 605 606 607 608 610 611 613 614 615 616 617 618 620 622 623 624 625 626 627 628 631 632 633 634 635 636 637 638 640 641 642 643 644 645 646 647 650 651 652 653 654 655 656 658 660 661 662 663 664 665 667 668 670 671 672 673 674 676 677 678 680 681 682 683 685 686 687 688 700 701 703 704 705 706 707 708 710 712 713 714 715 716 717 718 721 722 723 724 725 726 727 728 730 731 732 733 734 735 736 737 740 741 742 743 744 745 746 748 750 751 752 753 754 755 757 758 760 761 762 763 764 766 767 768 770 771 772 773 775 776 777 778 780 781 782 784 785 786 787 788 800 802 803 804 805 806 807 808 811 812 813 814 815 816 817 818 820 821 822 823 824 825 826 827 830 831 832 833 834 835 836 838 840 841 842 843 844 845 847 848 850 851 852 853 854 856 857 858 860 861 862 863 865 866 867 868 870 871 872 874 875 876 877 878 880 881 883 884 885 886 887 888 1000 1001 1002 1003 1004 1005 1006 1007 1010 1011 1012 1013 1014 1015 1016 1018 1020 1021 1022 1023 1024 1025 1027 1028 1030 1031 1032 1033 1034 1036 1037 1038 1040 1041 1042 1043 1045 1046 1047 1048 1050 1051 1052 1054 1055 1056 1057 1058 1060 1061 1063 1064 1065 1066 1067 1068 1070 1072 1073 1074 1075 1076 1077 1078 1081 1082 1083 1084 1085 1086 1087 1088 1100 1101 1102 1103 1104 1105 1106 1108 1110 1111 1112 1113 1114 1115 1117 1118 1120 1121 1122 1123 1124 1126 1127 1128 1130 1131 1132 1133 1135 1136 1137 1138 1140 1141 1142 1144 1145 1146 1147 1148 1150 1151 1153 1154 1155 1156 1157 1158 1160 1162 1163 1164 1165 1166 1167 1168 1171 1172 1173 1174 1175 1176 1177 1178 1180 1181 1182 1183 1184 1185 1186 1187 1200 1201 1202 1203 1204 1205 1207 1208 1210 1211 1212 1213 1214 1216 1217 1218 1220 1221 1222 1223 1225 1226 1227 1228 1230 1231 1232 1234 1235 1236 1237 1238 1240 1241 1243 1244 1245 1246 1247 1248 1250 1252 1253 1254 1255 1256 1257 1258 1261 1262 1263 1264 1265 1266 1267 1268 1270 1271 1272 1273 1274 1275 1276 1277 1280 1281 1282 1283 1284 1285 1286 1288 1300 1301 1302 1303 1304 1306 1307 1308 1310 1311 1312 1313 1315 1316 1317 1318 1320 1321 1322 1324 1325 1326 1327 1328 1330 1331 1333 1334 1335 1336 1337 1338 1340 1342 1343 1344 1345 1346 1347 1348 1351 1352 1353 1354 1355 1356 1357 1358 1360 1361 1362 1363 1364 1365 1366 1367 1370 1371 1372 1373 1374 1375 1376 1378 1380 1381 1382 1383 1384 1385 1387 1388 1400 1401 1402 1403 1405 1406 1407 1408 1410 1411 1412 1414 1415 1416 1417 1418 1420 1421 1423 1424 1425 1426 1427 1428 1430 1432 1433 1434 1435 1436 1437 1438 1441 1442 1443 1444 1445 1446 1447 1448 1450 1451 1452 1453 1454 1455 1456 1457 1460 1461 1462 1463 1464 1465 1466 1468 1470 1471 1472 1473 1474 1475 1477 1478 1480 1481 1482 1483 1484 1486 1487 1488 1500 1501 1502 1504 1505 1506 1507 1508 1510 1511 1513 1514 1515 1516 1517 1518 1520 1522 1523 1524 1525 1526 1527 1528 1531 1532 1533 1534 1535 1536 1537 1538 1540 1541 1542 1543 1544 1545 1546 1547 1550 1551 1552 1553 1554 1555 1556 1558 1560 1561 1562 1563 1564 1565 1567 1568 1570 1571 1572 1573 1574 1576 1577 1578 1580 1581 1582 1583 1585 1586 1587 1588 1600 1601 1603 1604 1605 1606 1607 1608 1610 1612 1613 1614 1615 1616 1617 1618 1621 1622 1623 1624 1625 1626 1627 1628 1630 1631 1632 1633 1634 1635 1636 1637 1640 1641 1642 1643 1644 1645 1646 1648 1650 1651 1652 1653 1654 1655 1657 1658 1660 1661 1662 1663 1664 1666 1667 1668 1670 1671 1672 1673 1675 1676 1677 1678 1680 1681 1682 1684 1685 1686 1687 1688 1700 1702 1703 1704 1705 1706 1707 1708 1711 1712 1713 1714 1715 1716 1717 1718 1720 1721 1722 1723 1724 1725 1726 1727 1730 1731 1732 1733 1734 1735 1736 1738 1740 1741 1742 1743 1744 1745 1747 1748 1750 1751 1752 1753 1754 1756 1757 1758 1760 1761 1762 1763 1765 1766 1767 1768 1770 1771 1772 1774 1775 1776 1777 1778 1780 1781 1783 1784 1785 1786 1787 1788 1801 1802 1803 1804 1805 1806 1807 1808 1810 1811 1812 1813 1814 1815 1816 1817 1820 1821 1822 1823 1824 1825 1826 1828 1830 1831 1832 1833 1834 1835 1837 1838 1840 1841 1842 1843 1844 1846 1847 1848 1850 1851 1852 1853 1855 1856 1857 1858 1860 1861 1862 1864 1865 1866 1867 1868 1870 1871 1873 1874 1875 1876 1877 1878 1880 1882 1883 1884 1885 1886 1887 1888 2000 2001 2002 2003 2004 2005 2006 2008 2010 2011 2012 2013 2014 2015 2017 2018 2020 2021 2022 2023 2024 2026 2027 2028 2030 2031 2032 2033 2035 2036 2037 2038 2040 2041 2042 2044 2045 2046 2047 2048 2050 2051 2053 2054 2055 2056 2057 2058 2060 2062 2063 2064 2065 2066 2067 2068 2071 2072 2073 2074 2075 2076 2077 2078 2080 2081 2082 2083 2084 2085 2086 2087 2100 2101 2102 2103 2104 2105 2107 2108 2110 2111 2112 2113 2114 2116 2117 2118 2120 2121 2122 2123 2125 2126 2127 2128 2130 2131 2132 2134 2135 2136 2137 2138 2140 2141 2143 2144 2145 2146 2147 2148 2150 2152 2153 2154 2155 2156 2157 2158 2161 2162 2163 2164 2165 2166 2167 2168 2170 2171 2172 2173 2174 2175 2176 2177 2180 2181 2182 2183 2184 2185 2186 2188 2200 2201 2202 2203 2204 2206 2207 2208 2210 2211 2212 2213 2215 2216 2217 2218 2220 2221 2222 2224 2225 2226 2227 2228 2230 2231 2233 2234 2235 2236 2237 2238 2240 2242 2243 2244 2245 2246 2247 2248 2251 2252 2253 2254 2255 2256 2257 2258 2260 2261 2262 2263 2264 2265 2266 2267 2270 2271 2272 2273 2274 2275 2276 2278 2280 2281 2282 2283 2284 2285 2287 2288 2300 2301 2302 2303 2305 2306 2307 2308 2310 2311 2312 2314 2315 2316 2317 2318 2320 2321 2323 2324 2325 2326 2327 2328 2330 2332 2333 2334 2335 2336 2337 2338 2341 2342 2343 2344 2345 2346 2347 2348 2350 2351 2352 2353 2354 2355 2356 2357 2360 2361 2362 2363 2364 2365 2366 2368 2370 2371 2372 2373 2374 2375 2377 2378 2380 2381 2382 2383 2384 2386 2387 2388 2400 2401 2402 2404 2405 2406 2407 2408 2410 2411 2413 2414 2415 2416 2417 2418 2420 2422 2423 2424 2425 2426 2427 2428 2431 2432 2433 2434 2435 2436 2437 2438 2440 2441 2442 2443 2444 2445 2446 2447 2450 2451 2452 2453 2454 2455 2456 2458 2460 2461 2462 2463 2464 2465 2467 2468 2470 2471 2472 2473 2474 2476 2477 2478 2480 2481 2482 2483 2485 2486 2487 2488 2500 2501 2503 2504 2505 2506 2507 2508 2510 2512 2513 2514 2515 2516 2517 2518 2521 2522 2523 2524 2525 2526 2527 2528 2530 2531 2532 2533 2534 2535 2536 2537 2540 2541 2542 2543 2544 2545 2546 2548 2550 2551 2552 2553 2554 2555 2557 2558 2560 2561 2562 2563 2564 2566 2567 2568 2570 2571 2572 2573 2575 2576 2577 2578 2580 2581 2582 2584 2585 2586 2587 2588 2600 2602 2603 2604 2605 2606 2607 2608 2611 2612 2613 2614 2615 2616 2617 2618 2620 2621 2622 2623 2624 2625 2626 2627 2630 2631 2632 2633 2634 2635 2636 2638 2640 2641 2642 2643 2644 2645 2647 2648 2650 2651 2652 2653 2654 2656 2657 2658 2660 2661 2662 2663 2665 2666 2667 2668 2670 2671 2672 2674 2675 2676 2677 2678 2680 2681 2683 2684 2685 2686 2687 2688 2701 2702 2703 2704 2705 2706 2707 2708 2710 2711 2712 2713 2714 2715 2716 2717 2720 2721 2722 2723 2724 2725 2726 2728 2730 2731 2732 2733 2734 2735 2737 2738 2740 2741 2742 2743 2744 2746 2747 2748 2750 2751 2752 2753 2755 2756 2757 2758 2760 2761 2762 2764 2765 2766 2767 2768 2770 2771 2773 2774 2775 2776 2777 2778 2780 2782 2783 2784 2785 2786 2787 2788 2800 2801 2802 2803 2804 2805 2806 2807 2810 2811 2812 2813 2814 2815 2816 2818 2820 2821 2822 2823 2824 2825 2827 2828 2830 2831 2832 2833 2834 2836 2837 2838 2840 2841 2842 2843 2845 2846 2847 2848 2850 2851 2852 2854 2855 2856 2857 2858 2860 2861 2863 2864 2865 2866 2867 2868 2870 2872 2873 2874 2875 2876 2877 2878 2881 2882 2883 2884 2885 2886 2887 2888 3000 3001 3002 3003 3004 3005 3007 3008 3010 3011 3012 3013 3014 3016 3017 3018 3020 3021 3022 3023 3025 3026 3027 3028 3030 3031 3032 3034 3035 3036 3037 3038 3040 3041 3043 3044 3045 3046 3047 3048 3050 3052 3053 3054 3055 3056 3057 3058 3061 3062 3063 3064 3065 3066 3067 3068 3070 3071 3072 3073 3074 3075 3076 3077 3080 3081 3082 3083 3084 3085 3086 3088 3100 3101 3102 3103 3104 3106 3107 3108 3110 3111 3112 3113 3115 3116 3117 3118 3120 3121 3122 3124 3125 3126 3127 3128 3130 3131 3133 3134 3135 3136 3137 3138 3140 3142 3143 3144 3145 3146 3147 3148 3151 3152 3153 3154 3155 3156 3157 3158 3160 3161 3162 3163 3164 3165 3166 3167 3170 3171 3172 3173 3174 3175 3176 3178 3180 3181 3182 3183 3184 3185 3187 3188 3200 3201 3202 3203 3205 3206 3207 3208 3210 3211 3212 3214 3215 3216 3217 3218 3220 3221 3223 3224 3225 3226 3227 3228 3230 3232 3233 3234 3235 3236 3237 3238 3241 3242 3243 3244 3245 3246 3247 3248 3250 3251 3252 3253 3254 3255 3256 3257 3260 3261 3262 3263 3264 3265 3266 3268 3270 3271 3272 3273 3274 3275 3277 3278 3280 3281 3282 3283 3284 3286 3287 3288 3300 3301 3302 3304 3305 3306 3307 3308 3310 3311 3313 3314 3315 3316 3317 3318 3320 3322 3323 3324 3325 3326 3327 3328 3331 3332 3333 3334 3335 3336 3337 3338 3340 3341 3342 3343 3344 3345 3346 3347 3350 3351 3352 3353 3354 3355 3356 3358 3360 3361 3362 3363 3364 3365 3367 3368 3370 3371 3372 3373 3374 3376 3377 3378 3380 3381 3382 3383 3385 3386 3387 3388 3400 3401 3403 3404 3405 3406 3407 3408 3410 3412 3413 3414 3415 3416 3417 3418 3421 3422 3423 3424 3425 3426 3427 3428 3430 3431 3432 3433 3434 3435 3436 3437 3440 3441 3442 3443 3444 3445 3446 3448 3450 3451 3452 3453 3454 3455 3457 3458 3460 3461 3462 3463 3464 3466 3467 3468 3470 3471 3472 3473 3475 3476 3477 3478 3480 3481 3482 3484 3485 3486 3487 3488 3500 3502 3503 3504 3505 3506 3507 3508 3511 3512 3513 3514 3515 3516 3517 3518 3520 3521 3522 3523 3524 3525 3526 3527 3530 3531 3532 3533 3534 3535 3536 3538 3540 3541 3542 3543 3544 3545 3547 3548 3550 3551 3552 3553 3554 3556 3557 3558 3560 3561 3562 3563 3565 3566 3567 3568 3570 3571 3572 3574 3575 3576 3577 3578 3580 3581 3583 3584 3585 3586 3587 3588 3601 3602 3603 3604 3605 3606 3607 3608 3610 3611 3612 3613 3614 3615 3616 3617 3620 3621 3622 3623 3624 3625 3626 3628 3630 3631 3632 3633 3634 3635 3637 3638 3640 3641 3642 3643 3644 3646 3647 3648 3650 3651 3652 3653 3655 3656 3657 3658 3660 3661 3662 3664 3665 3666 3667 3668 3670 3671 3673 3674 3675 3676 3677 3678 3680 3682 3683 3684 3685 3686 3687 3688 3700 3701 3702 3703 3704 3705 3706 3707 3710 3711 3712 3713 3714 3715 3716 3718 3720 3721 3722 3723 3724 3725 3727 3728 3730 3731 3732 3733 3734 3736 3737 3738 3740 3741 3742 3743 3745 3746 3747 3748 3750 3751 3752 3754 3755 3756 3757 3758 3760 3761 3763 3764 3765 3766 3767 3768 3770 3772 3773 3774 3775 3776 3777 3778 3781 3782 3783 3784 3785 3786 3787 3788 3800 3801 3802 3803 3804 3805 3806 3808 3810 3811 3812 3813 3814 3815 3817 3818 3820 3821 3822 3823 3824 3826 3827 3828 3830 3831 3832 3833 3835 3836 3837 3838 3840 3841 3842 3844 3845 3846 3847 3848 3850 3851 3853 3854 3855 3856 3857 3858 3860 3862 3863 3864 3865 3866 3867 3868 3871 3872 3873 3874 3875 3876 3877 3878 3880 3881 3882 3883 3884 3885 3886 3887 4000 4001 4002 4003 4004 4006 4007 4008 4010 4011 4012 4013 4015 4016 4017 4018 4020 4021 4022 4024 4025 4026 4027 4028 4030 4031 4033 4034 4035 4036 4037 4038 4040 4042 4043 4044 4045 4046 4047 4048 4051 4052 4053 4054 4055 4056 4057 4058 4060 4061 4062 4063 4064 4065 4066 4067 4070 4071 4072 4073 4074 4075 4076 4078 4080 4081 4082 4083 4084 4085 4087 4088 4100 4101 4102 4103 4105 4106 4107 4108 4110 4111 4112 4114 4115 4116 4117 4118 4120 4121 4123 4124 4125 4126 4127 4128 4130 4132 4133 4134 4135 4136 4137 4138 4141 4142 4143 4144 4145 4146 4147 4148 4150 4151 4152 4153 4154 4155 4156 4157 4160 4161 4162 4163 4164 4165 4166 4168 4170 4171 4172 4173 4174 4175 4177 4178 4180 4181 4182 4183 4184 4186 4187 4188 4200 4201 4202 4204 4205 4206 4207 4208 4210 4211 4213 4214 4215 4216 4217 4218 4220 4222 4223 4224 4225 4226 4227 4228 4231 4232 4233 4234 4235 4236 4237 4238 4240 4241 4242 4243 4244 4245 4246 4247 4250 4251 4252 4253 4254 4255 4256 4258 4260 4261 4262 4263 4264 4265 4267 4268 4270 4271 4272 4273 4274 4276 4277 4278 4280 4281 4282 4283 4285 4286 4287 4288 4300 4301 4303 4304 4305 4306 4307 4308 4310 4312 4313 4314 4315 4316 4317 4318 4321 4322 4323 4324 4325 4326 4327 4328 4330 4331 4332 4333 4334 4335 4336 4337 4340 4341 4342 4343 4344 4345 4346 4348 4350 4351 4352 4353 4354 4355 4357 4358 4360 4361 4362 4363 4364 4366 4367 4368 4370 4371 4372 4373 4375 4376 4377 4378 4380 4381 4382 4384 4385 4386 4387 4388 4400 4402 4403 4404 4405 4406 4407 4408 4411 4412 4413 4414 4415 4416 4417 4418 4420 4421 4422 4423 4424 4425 4426 4427 4430 4431 4432 4433 4434 4435 4436 4438 4440 4441 4442 4443 4444 4445 4447 4448 4450 4451 4452 4453 4454 4456 4457 4458 4460 4461 4462 4463 4465 4466 4467 4468 4470 4471 4472 4474 4475 4476 4477 4478 4480 4481 4483 4484 4485 4486 4487 4488 4501 4502 4503 4504 4505 4506 4507 4508 4510 4511 4512 4513 4514 4515 4516 4517 4520 4521 4522 4523 4524 4525 4526 4528 4530 4531 4532 4533 4534 4535 4537 4538 4540 4541 4542 4543 4544 4546 4547 4548 4550 4551 4552 4553 4555 4556 4557 4558 4560 4561 4562 4564 4565 4566 4567 4568 4570 4571 4573 4574 4575 4576 4577 4578 4580 4582 4583 4584 4585 4586 4587 4588 4600 4601 4602 4603 4604 4605 4606 4607 4610 4611 4612 4613 4614 4615 4616 4618 4620 4621 4622 4623 4624 4625 4627 4628 4630 4631 4632 4633 4634 4636 4637 4638 4640 4641 4642 4643 4645 4646 4647 4648 4650 4651 4652 4654 4655 4656 4657 4658 4660 4661 4663 4664 4665 4666 4667 4668 4670 4672 4673 4674 4675 4676 4677 4678 4681 4682 4683 4684 4685 4686 4687 4688 4700 4701 4702 4703 4704 4705 4706 4708 4710 4711 4712 4713 4714 4715 4717 4718 4720 4721 4722 4723 4724 4726 4727 4728 4730 4731 4732 4733 4735 4736 4737 4738 4740 4741 4742 4744 4745 4746 4747 4748 4750 4751 4753 4754 4755 4756 4757 4758 4760 4762 4763 4764 4765 4766 4767 4768 4771 4772 4773 4774 4775 4776 4777 4778 4780 4781 4782 4783 4784 4785 4786 4787 4800 4801 4802 4803 4804 4805 4807 4808 4810 4811 4812 4813 4814 4816 4817 4818 4820 4821 4822 4823 4825 4826 4827 4828 4830 4831 4832 4834 4835 4836 4837 4838 4840 4841 4843 4844 4845 4846 4847 4848 4850 4852 4853 4854 4855 4856 4857 4858 4861 4862 4863 4864 4865 4866 4867 4868 4870 4871 4872 4873 4874 4875 4876 4877 4880 4881 4882 4883 4884 4885 4886 4888 5000 5001 5002 5003 5005 5006 5007 5008 5010 5011 5012 5014 5015 5016 5017 5018 5020 5021 5023 5024 5025 5026 5027 5028 5030 5032 5033 5034 5035 5036 5037 5038 5041 5042 5043 5044 5045 5046 5047 5048 5050 5051 5052 5053 5054 5055 5056 5057 5060 5061 5062 5063 5064 5065 5066 5068 5070 5071 5072 5073 5074 5075 5077 5078 5080 5081 5082 5083 5084 5086 5087 5088 5100 5101 5102 5104 5105 5106 5107 5108 5110 5111 5113 5114 5115 5116 5117 5118 5120 5122 5123 5124 5125 5126 5127 5128 5131 5132 5133 5134 5135 5136 5137 5138 5140 5141 5142 5143 5144 5145 5146 5147 5150 5151 5152 5153 5154 5155 5156 5158 5160 5161 5162 5163 5164 5165 5167 5168 5170 5171 5172 5173 5174 5176 5177 5178 5180 5181 5182 5183 5185 5186 5187 5188 5200 5201 5203 5204 5205 5206 5207 5208 5210 5212 5213 5214 5215 5216 5217 5218 5221 5222 5223 5224 5225 5226 5227 5228 5230 5231 5232 5233 5234 5235 5236 5237 5240 5241 5242 5243 5244 5245 5246 5248 5250 5251 5252 5253 5254 5255 5257 5258 5260 5261 5262 5263 5264 5266 5267 5268 5270 5271 5272 5273 5275 5276 5277 5278 5280 5281 5282 5284 5285 5286 5287 5288 5300 5302 5303 5304 5305 5306 5307 5308 5311 5312 5313 5314 5315 5316 5317 5318 5320 5321 5322 5323 5324 5325 5326 5327 5330 5331 5332 5333 5334 5335 5336 5338 5340 5341 5342 5343 5344 5345 5347 5348 5350 5351 5352 5353 5354 5356 5357 5358 5360 5361 5362 5363 5365 5366 5367 5368 5370 5371 5372 5374 5375 5376 5377 5378 5380 5381 5383 5384 5385 5386 5387 5388 5401 5402 5403 5404 5405 5406 5407 5408 5410 5411 5412 5413 5414 5415 5416 5417 5420 5421 5422 5423 5424 5425 5426 5428 5430 5431 5432 5433 5434 5435 5437 5438 5440 5441 5442 5443 5444 5446 5447 5448 5450 5451 5452 5453 5455 5456 5457 5458 5460 5461 5462 5464 5465 5466 5467 5468 5470 5471 5473 5474 5475 5476 5477 5478 5480 5482 5483 5484 5485 5486 5487 5488 5500 5501 5502 5503 5504 5505 5506 5507 5510 5511 5512 5513 5514 5515 5516 5518 5520 5521 5522 5523 5524 5525 5527 5528 5530 5531 5532 5533 5534 5536 5537 5538 5540 5541 5542 5543 5545 5546 5547 5548 5550 5551 5552 5554 5555 5556 5557 5558 5560 5561 5563 5564 5565 5566 5567 5568 5570 5572 5573 5574 5575 5576 5577 5578 5581 5582 5583 5584 5585 5586 5587 5588 5600 5601 5602 5603 5604 5605 5606 5608 5610 5611 5612 5613 5614 5615 5617 5618 5620 5621 5622 5623 5624 5626 5627 5628 5630 5631 5632 5633 5635 5636 5637 5638 5640 5641 5642 5644 5645 5646 5647 5648 5650 5651 5653 5654 5655 5656 5657 5658 5660 5662 5663 5664 5665 5666 5667 5668 5671 5672 5673 5674 5675 5676 5677 5678 5680 5681 5682 5683 5684 5685 5686 5687 5700 5701 5702 5703 5704 5705 5707 5708 5710 5711 5712 5713 5714 5716 5717 5718 5720 5721 5722 5723 5725 5726 5727 5728 5730 5731 5732 5734 5735 5736 5737 5738 5740 5741 5743 5744 5745 5746 5747 5748 5750 5752 5753 5754 5755 5756 5757 5758 5761 5762 5763 5764 5765 5766 5767 5768 5770 5771 5772 5773 5774 5775 5776 5777 5780 5781 5782 5783 5784 5785 5786 5788 5800 5801 5802 5803 5804 5806 5807 5808 5810 5811 5812 5813 5815 5816 5817 5818 5820 5821 5822 5824 5825 5826 5827 5828 5830 5831 5833 5834 5835 5836 5837 5838 5840 5842 5843 5844 5845 5846 5847 5848 5851 5852 5853 5854 5855 5856 5857 5858 5860 5861 5862 5863 5864 5865 5866 5867 5870 5871 5872 5873 5874 5875 5876 5878 5880 5881 5882 5883 5884 5885 5887 5888 6000 6001 6002 6004 6005 6006 6007 6008 6010 6011 6013 6014 6015 6016 6017 6018 6020 6022 6023 6024 6025 6026 6027 6028 6031 6032 6033 6034 6035 6036 6037 6038 6040 6041 6042 6043 6044 6045 6046 6047 6050 6051 6052 6053 6054 6055 6056 6058 6060 6061 6062 6063 6064 6065 6067 6068 6070 6071 6072 6073 6074 6076 6077 6078 6080 6081 6082 6083 6085 6086 6087 6088 6100 6101 6103 6104 6105 6106 6107 6108 6110 6112 6113 6114 6115 6116 6117 6118 6121 6122 6123 6124 6125 6126 6127 6128 6130 6131 6132 6133 6134 6135 6136 6137 6140 6141 6142 6143 6144 6145 6146 6148 6150 6151 6152 6153 6154 6155 6157 6158 6160 6161 6162 6163 6164 6166 6167 6168 6170 6171 6172 6173 6175 6176 6177 6178 6180 6181 6182 6184 6185 6186 6187 6188 6200 6202 6203 6204 6205 6206 6207 6208 6211 6212 6213 6214 6215 6216 6217 6218 6220 6221 6222 6223 6224 6225 6226 6227 6230 6231 6232 6233 6234 6235 6236 6238 6240 6241 6242 6243 6244 6245 6247 6248 6250 6251 6252 6253 6254 6256 6257 6258 6260 6261 6262 6263 6265 6266 6267 6268 6270 6271 6272 6274 6275 6276 6277 6278 6280 6281 6283 6284 6285 6286 6287 6288 6301 6302 6303 6304 6305 6306 6307 6308 6310 6311 6312 6313 6314 6315 6316 6317 6320 6321 6322 6323 6324 6325 6326 6328 6330 6331 6332 6333 6334 6335 6337 6338 6340 6341 6342 6343 6344 6346 6347 6348 6350 6351 6352 6353 6355 6356 6357 6358 6360 6361 6362 6364 6365 6366 6367 6368 6370 6371 6373 6374 6375 6376 6377 6378 6380 6382 6383 6384 6385 6386 6387 6388 6400 6401 6402 6403 6404 6405 6406 6407 6410 6411 6412 6413 6414 6415 6416 6418 6420 6421 6422 6423 6424 6425 6427 6428 6430 6431 6432 6433 6434 6436 6437 6438 6440 6441 6442 6443 6445 6446 6447 6448 6450 6451 6452 6454 6455 6456 6457 6458 6460 6461 6463 6464 6465 6466 6467 6468 6470 6472 6473 6474 6475 6476 6477 6478 6481 6482 6483 6484 6485 6486 6487 6488 6500 6501 6502 6503 6504 6505 6506 6508 6510 6511 6512 6513 6514 6515 6517 6518 6520 6521 6522 6523 6524 6526 6527 6528 6530 6531 6532 6533 6535 6536 6537 6538 6540 6541 6542 6544 6545 6546 6547 6548 6550 6551 6553 6554 6555 6556 6557 6558 6560 6562 6563 6564 6565 6566 6567 6568 6571 6572 6573 6574 6575 6576 6577 6578 6580 6581 6582 6583 6584 6585 6586 6587 6600 6601 6602 6603 6604 6605 6607 6608 6610 6611 6612 6613 6614 6616 6617 6618 6620 6621 6622 6623 6625 6626 6627 6628 6630 6631 6632 6634 6635 6636 6637 6638 6640 6641 6643 6644 6645 6646 6647 6648 6650 6652 6653 6654 6655 6656 6657 6658 6661 6662 6663 6664 6665 6666 6667 6668 6670 6671 6672 6673 6674 6675 6676 6677 6680 6681 6682 6683 6684 6685 6686 6688 6700 6701 6702 6703 6704 6706 6707 6708 6710 6711 6712 6713 6715 6716 6717 6718 6720 6721 6722 6724 6725 6726 6727 6728 6730 6731 6733 6734 6735 6736 6737 6738 6740 6742 6743 6744 6745 6746 6747 6748 6751 6752 6753 6754 6755 6756 6757 6758 6760 6761 6762 6763 6764 6765 6766 6767 6770 6771 6772 6773 6774 6775 6776 6778 6780 6781 6782 6783 6784 6785 6787 6788 6800 6801 6802 6803 6805 6806 6807 6808 6810 6811 6812 6814 6815 6816 6817 6818 6820 6821 6823 6824 6825 6826 6827 6828 6830 6832 6833 6834 6835 6836 6837 6838 6841 6842 6843 6844 6845 6846 6847 6848 6850 6851 6852 6853 6854 6855 6856 6857 6860 6861 6862 6863 6864 6865 6866 6868 6870 6871 6872 6873 6874 6875 6877 6878 6880 6881 6882 6883 6884 6886 6887 6888 7000 7001 7003 7004 7005 7006 7007 7008 7010 7012 7013 7014 7015 7016 7017 7018 7021 7022 7023 7024 7025 7026 7027 7028 7030 7031 7032 7033 7034 7035 7036 7037 7040 7041 7042 7043 7044 7045 7046 7048 7050 7051 7052 7053 7054 7055 7057 7058 7060 7061 7062 7063 7064 7066 7067 7068 7070 7071 7072 7073 7075 7076 7077 7078 7080 7081 7082 7084 7085 7086 7087 7088 7100 7102 7103 7104 7105 7106 7107 7108 7111 7112 7113 7114 7115 7116 7117 7118 7120 7121 7122 7123 7124 7125 7126 7127 7130 7131 7132 7133 7134 7135 7136 7138 7140 7141 7142 7143 7144 7145 7147 7148 7150 7151 7152 7153 7154 7156 7157 7158 7160 7161 7162 7163 7165 7166 7167 7168 7170 7171 7172 7174 7175 7176 7177 7178 7180 7181 7183 7184 7185 7186 7187 7188 7201 7202 7203 7204 7205 7206 7207 7208 7210 7211 7212 7213 7214 7215 7216 7217 7220 7221 7222 7223 7224 7225 7226 7228 7230 7231 7232 7233 7234 7235 7237 7238 7240 7241 7242 7243 7244 7246 7247 7248 7250 7251 7252 7253 7255 7256 7257 7258 7260 7261 7262 7264 7265 7266 7267 7268 7270 7271 7273 7274 7275 7276 7277 7278 7280 7282 7283 7284 7285 7286 7287 7288 7300 7301 7302 7303 7304 7305 7306 7307 7310 7311 7312 7313 7314 7315 7316 7318 7320 7321 7322 7323 7324 7325 7327 7328 7330 7331 7332 7333 7334 7336 7337 7338 7340 7341 7342 7343 7345 7346 7347 7348 7350 7351 7352 7354 7355 7356 7357 7358 7360 7361 7363 7364 7365 7366 7367 7368 7370 7372 7373 7374 7375 7376 7377 7378 7381 7382 7383 7384 7385 7386 7387 7388 7400 7401 7402 7403 7404 7405 7406 7408 7410 7411 7412 7413 7414 7415 7417 7418 7420 7421 7422 7423 7424 7426 7427 7428 7430 7431 7432 7433 7435 7436 7437 7438 7440 7441 7442 7444 7445 7446 7447 7448 7450 7451 7453 7454 7455 7456 7457 7458 7460 7462 7463 7464 7465 7466 7467 7468 7471 7472 7473 7474 7475 7476 7477 7478 7480 7481 7482 7483 7484 7485 7486 7487 7500 7501 7502 7503 7504 7505 7507 7508 7510 7511 7512 7513 7514 7516 7517 7518 7520 7521 7522 7523 7525 7526 7527 7528 7530 7531 7532 7534 7535 7536 7537 7538 7540 7541 7543 7544 7545 7546 7547 7548 7550 7552 7553 7554 7555 7556 7557 7558 7561 7562 7563 7564 7565 7566 7567 7568 7570 7571 7572 7573 7574 7575 7576 7577 7580 7581 7582 7583 7584 7585 7586 7588 7600 7601 7602 7603 7604 7606 7607 7608 7610 7611 7612 7613 7615 7616 7617 7618 7620 7621 7622 7624 7625 7626 7627 7628 7630 7631 7633 7634 7635 7636 7637 7638 7640 7642 7643 7644 7645 7646 7647 7648 7651 7652 7653 7654 7655 7656 7657 7658 7660 7661 7662 7663 7664 7665 7666 7667 7670 7671 7672 7673 7674 7675 7676 7678 7680 7681 7682 7683 7684 7685 7687 7688 7700 7701 7702 7703 7705 7706 7707 7708 7710 7711 7712 7714 7715 7716 7717 7718 7720 7721 7723 7724 7725 7726 7727 7728 7730 7732 7733 7734 7735 7736 7737 7738 7741 7742 7743 7744 7745 7746 7747 7748 7750 7751 7752 7753 7754 7755 7756 7757 7760 7761 7762 7763 7764 7765 7766 7768 7770 7771 7772 7773 7774 7775 7777 7778 7780 7781 7782 7783 7784 7786 7787 7788 7800 7801 7802 7804 7805 7806 7807 7808 7810 7811 7813 7814 7815 7816 7817 7818 7820 7822 7823 7824 7825 7826 7827 7828 7831 7832 7833 7834 7835 7836 7837 7838 7840 7841 7842 7843 7844 7845 7846 7847 7850 7851 7852 7853 7854 7855 7856 7858 7860 7861 7862 7863 7864 7865 7867 7868 7870 7871 7872 7873 7874 7876 7877 7878 7880 7881 7882 7883 7885 7886 7887 7888 8000 8002 8003 8004 8005 8006 8007 8008 8011 8012 8013 8014 8015 8016 8017 8018 8020 8021 8022 8023 8024 8025 8026 8027 8030 8031 8032 8033 8034 8035 8036 8038 8040 8041 8042 8043 8044 8045 8047 8048 8050 8051 8052 8053 8054 8056 8057 8058 8060 8061 8062 8063 8065 8066 8067 8068 8070 8071 8072 8074 8075 8076 8077 8078 8080 8081 8083 8084 8085 8086 8087 8088 8101 8102 8103 8104 8105 8106 8107 8108 8110 8111 8112 8113 8114 8115 8116 8117 8120 8121 8122 8123 8124 8125 8126 8128 8130 8131 8132 8133 8134 8135 8137 8138 8140 8141 8142 8143 8144 8146 8147 8148 8150 8151 8152 8153 8155 8156 8157 8158 8160 8161 8162 8164 8165 8166 8167 8168 8170 8171 8173 8174 8175 8176 8177 8178 8180 8182 8183 8184 8185 8186 8187 8188 8200 8201 8202 8203 8204 8205 8206 8207 8210 8211 8212 8213 8214 8215 8216 8218 8220 8221 8222 8223 8224 8225 8227 8228 8230 8231 8232 8233 8234 8236 8237 8238 8240 8241 8242 8243 8245 8246 8247 8248 8250 8251 8252 8254 8255 8256 8257 8258 8260 8261 8263 8264 8265 8266 8267 8268 8270 8272 8273 8274 8275 8276 8277 8278 8281 8282 8283 8284 8285 8286 8287 8288 8300 8301 8302 8303 8304 8305 8306 8308 8310 8311 8312 8313 8314 8315 8317 8318 8320 8321 8322 8323 8324 8326 8327 8328 8330 8331 8332 8333 8335 8336 8337 8338 8340 8341 8342 8344 8345 8346 8347 8348 8350 8351 8353 8354 8355 8356 8357 8358 8360 8362 8363 8364 8365 8366 8367 8368 8371 8372 8373 8374 8375 8376 8377 8378 8380 8381 8382 8383 8384 8385 8386 8387 8400 8401 8402 8403 8404 8405 8407 8408 8410 8411 8412 8413 8414 8416 8417 8418 8420 8421 8422 8423 8425 8426 8427 8428 8430 8431 8432 8434 8435 8436 8437 8438 8440 8441 8443 8444 8445 8446 8447 8448 8450 8452 8453 8454 8455 8456 8457 8458 8461 8462 8463 8464 8465 8466 8467 8468 8470 8471 8472 8473 8474 8475 8476 8477 8480 8481 8482 8483 8484 8485 8486 8488 8500 8501 8502 8503 8504 8506 8507 8508 8510 8511 8512 8513 8515 8516 8517 8518 8520 8521 8522 8524 8525 8526 8527 8528 8530 8531 8533 8534 8535 8536 8537 8538 8540 8542 8543 8544 8545 8546 8547 8548 8551 8552 8553 8554 8555 8556 8557 8558 8560 8561 8562 8563 8564 8565 8566 8567 8570 8571 8572 8573 8574 8575 8576 8578 8580 8581 8582 8583 8584 8585 8587 8588 8600 8601 8602 8603 8605 8606 8607 8608 8610 8611 8612 8614 8615 8616 8617 8618 8620 8621 8623 8624 8625 8626 8627 8628 8630 8632 8633 8634 8635 8636 8637 8638 8641 8642 8643 8644 8645 8646 8647 8648 8650 8651 8652 8653 8654 8655 8656 8657 8660 8661 8662 8663 8664 8665 8666 8668 8670 8671 8672 8673 8674 8675 8677 8678 8680 8681 8682 8683 8684 8686 8687 8688 8700 8701 8702 8704 8705 8706 8707 8708 8710 8711 8713 8714 8715 8716 8717 8718 8720 8722 8723 8724 8725 8726 8727 8728 8731 8732 8733 8734 8735 8736 8737 8738 8740 8741 8742 8743 8744 8745 8746 8747 8750 8751 8752 8753 8754 8755 8756 8758 8760 8761 8762 8763 8764 8765 8767 8768 8770 8771 8772 8773 8774 8776 8777 8778 8780 8781 8782 8783 8785 8786 8787 8788 8800 8801 8803 8804 8805 8806 8807 8808 8810 8812 8813 8814 8815 8816 8817 8818 8821 8822 8823 8824 8825 8826 8827 8828 8830 8831 8832 8833 8834 8835 8836 8837 8840 8841 8842 8843 8844 8845 8846 8848 8850 8851 8852 8853 8854 8855 8857 8858 8860 8861 8862 8863 8864 8866 8867 8868 8870 8871 8872 8873 8875 8876 8877 8878 8880 8881 8882 8884 8885 8886 8887 8888 10000",
"category": "edge",
"hidden": true
},
{
"input": "9 10 0",
"expected": "1 2 3 4 5 6 7 8 9",
"category": "edge",
"hidden": true
},
{
"input": "10 10 0",
"expected": "1 2 3 4 5 6 7 8 9",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-C3",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u5.s2",
"difficulty": "medium",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "C3 · Longest Hot Streak",
"prompt": "You have `n` daily temperatures and a threshold `T`. A *hot streak* is a run of consecutive days where every temperature is **strictly greater** than `T`. Print the length of the longest hot streak (0 if there is none).",
"inputFormat": "Line 1: n T. Line 2: n integers.",
"outputFormat": "One integer.",
"constraints": "1 ≤ n ≤ 3000, -100 ≤ T, temperatures ≤ 100",
"steps": [],
"sampleInput": "7 30\n31 35 29 33 34 36 30",
"sampleOutput": "3",
"starter": "# read input with input(), print the answer\n",
"reference": "n, t = map(int, input().split())\na = list(map(int, input().split()))\nbest = 0\ncur = 0\nfor x in a:\n    if x > t:\n        cur += 1\n        if cur > best:\n            best = cur\n    else:\n        cur = 0\nprint(best)\n",
"hints": [
"Keep two numbers: cur (current streak) and best (longest so far).",
"Hot day → cur += 1. Not hot → cur = 0.",
"Update best every time cur grows — if you only update when a streak ends, a streak that reaches the last day is lost."
],
"explanation": "Concepts: for-each, counter reset, running best",
"tests": [
{
"input": "7 30\n31 35 29 33 34 36 30",
"expected": "3",
"category": "basic",
"hidden": false
},
{
"input": "3 40\n10 20 30",
"expected": "0",
"category": "normal",
"hidden": false
},
{
"input": "4 0\n1 2 3 4",
"expected": "4",
"category": "normal",
"hidden": false
},
{
"input": "1 5\n5",
"expected": "0",
"category": "edge",
"hidden": true
},
{
"input": "1 5\n6",
"expected": "1",
"category": "edge",
"hidden": true
},
{
"input": "6 -5\n-4 -4 -5 -3 -2 -1",
"expected": "3",
"category": "edge",
"hidden": true
},
{
"input": "5 10\n11 11 11 10 11",
"expected": "3",
"category": "edge",
"hidden": true
},
{
"input": "3000 0\n25 81 60 24 44 17 65 51 89 51 55 43 87 23 36 77 91 53 68 74 58 8 24 91 22 11 93 7 42 88 83 76 85 17 11 19 23 79 52 21 51 0 67 15 79 78 98 31 33 91 43 47 -2 58 63 55 31 42 59 14 10 98 15 68 25 42 55 45 74 78 72 3 86 82 68 38 93 29 84 7 56 56 41 66 98 64 64 9 32 34 1 7 72 2 5 64 54 69 10 46 99 79 99 70 55 75 58 66 -1 16 37 14 0 10 47 8 18 65 29 -1 2 92 6 93 74 63 12 90 39 88 16 36 57 27 38 88 56 85 28 48 27 62 37 50 2 59 28 73 20 53 21 95 11 72 57 72 45 58 64 -1 60 24 46 90 1 64 56 97 14 34 27 63 37 31 95 52 91 71 0 42 74 63 18 64 12 69 44 100 24 72 6 67 18 55 48 100 11 99 10 100 50 48 -3 28 22 3 30 93 99 18 64 31 44 7 29 18 1 24 87 77 99 88 68 11 54 67 82 1 42 85 56 62 77 1 21 80 80 58 3 34 8 18 80 5 32 23 -3 33 76 79 2 57 30 6 86 90 66 18 67 78 63 71 66 27 60 3 66 42 26 65 47 56 8 28 1 -2 49 46 68 8 53 83 76 19 18 27 18 68 22 61 93 40 48 32 79 80 18 56 8 -1 41 6 92 93 13 69 63 96 28 57 85 16 84 99 38 19 60 67 11 14 -3 45 8 86 60 77 50 82 69 40 62 42 7 92 84 72 -1 80 29 27 11 45 28 35 73 83 70 84 69 19 36 92 65 -2 0 40 91 19 88 55 72 9 28 82 57 93 17 74 61 81 58 11 5 13 -3 75 64 36 15 49 29 -1 53 74 34 16 45 78 77 -3 53 72 12 9 26 38 53 100 5 46 32 53 95 53 90 35 29 54 91 76 49 57 34 37 18 10 75 67 0 23 24 86 34 88 94 48 25 85 82 38 18 99 9 26 46 13 73 39 79 65 47 23 75 67 35 66 65 45 85 30 41 54 28 19 62 35 1 91 76 22 35 18 52 82 71 13 53 45 78 60 84 4 75 36 91 1 99 73 62 40 68 35 49 25 85 77 65 62 33 99 82 75 61 41 41 93 46 64 25 -2 50 64 51 46 76 43 99 28 68 71 45 42 92 0 10 27 24 19 59 76 47 57 17 52 62 21 44 0 66 7 9 11 24 47 12 55 73 41 78 63 77 9 50 27 38 36 -3 9 5 94 40 81 16 55 77 49 9 79 10 21 99 67 59 40 73 20 12 8 41 27 16 53 56 9 67 98 51 93 13 8 -1 84 56 51 5 53 60 4 54 57 41 92 9 3 49 20 51 78 5 29 88 66 64 28 51 10 41 18 -2 15 74 74 98 36 30 96 99 52 97 10 85 25 43 93 6 49 78 7 70 95 76 30 37 51 75 71 36 26 91 74 64 20 64 50 29 1 68 75 29 64 55 34 49 91 30 23 87 95 90 72 53 17 42 63 36 30 36 11 74 28 -3 22 73 73 40 86 37 90 78 12 81 40 48 79 51 75 56 74 45 83 10 44 52 93 84 54 71 38 69 45 42 -2 94 42 46 91 41 98 29 97 58 -2 43 49 56 2 74 -1 87 34 66 66 98 3 11 95 39 52 30 46 35 87 29 -3 23 24 4 6 26 19 3 87 43 76 66 55 10 83 75 65 63 78 76 3 34 13 10 50 26 11 85 5 10 98 98 6 72 91 89 46 1 14 53 68 91 0 93 95 33 49 44 68 83 98 53 21 3 50 36 16 31 78 65 18 74 47 88 3 5 55 70 49 58 53 78 78 15 97 -3 33 96 96 9 98 13 52 21 31 91 56 64 76 16 23 38 17 94 99 85 34 0 10 21 56 46 6 43 47 6 -2 43 70 82 8 32 67 25 21 40 29 8 35 65 68 11 66 6 85 25 56 68 41 97 97 14 18 16 21 67 29 84 12 46 29 72 79 57 43 21 21 94 19 43 57 5 78 73 14 76 33 99 99 65 3 68 41 25 89 32 57 78 1 36 16 31 55 47 98 88 10 23 36 12 30 83 50 6 58 37 33 35 13 86 3 5 34 93 52 8 22 80 22 66 -2 0 37 22 0 77 37 9 29 60 63 49 84 39 66 92 75 25 2 42 83 70 88 60 84 59 85 51 4 77 80 40 43 22 66 29 68 78 64 41 99 48 65 94 7 78 79 94 97 -1 52 56 84 3 79 73 2 57 15 81 57 48 12 88 79 42 12 30 12 28 51 25 79 23 32 24 55 84 -2 12 1 91 64 57 41 19 47 99 79 13 22 86 74 35 19 36 93 52 33 51 52 68 52 22 8 47 45 44 24 74 66 91 73 70 95 87 59 30 95 37 88 27 90 100 91 97 39 67 8 21 91 31 20 7 55 19 25 89 96 25 36 76 49 56 55 2 32 89 34 85 8 77 2 32 96 56 40 86 100 5 94 46 64 62 52 92 37 50 8 12 86 84 32 12 87 4 63 13 28 38 100 70 37 25 30 75 83 31 -2 83 33 18 69 32 96 58 32 55 63 93 88 91 6 95 67 13 31 99 31 47 -2 19 47 8 76 44 48 93 68 85 -3 91 68 -3 5 4 -1 88 2 77 37 78 13 -1 -1 59 3 95 -1 72 10 53 95 3 22 93 99 73 16 60 22 25 1 44 54 1 22 1 36 64 61 58 54 85 64 85 95 9 50 87 48 6 10 36 48 27 42 7 7 -3 20 0 28 62 27 1 3 36 -3 77 23 -3 -3 36 18 46 22 93 53 8 52 60 9 40 41 19 72 28 2 7 14 50 53 2 62 87 8 97 16 96 74 100 54 57 -1 40 97 60 74 89 19 71 87 76 18 23 73 62 5 91 21 22 59 4 13 59 84 9 62 50 12 44 68 12 14 71 73 73 10 34 59 -1 82 48 57 40 37 30 66 37 4 51 47 26 39 9 47 60 50 97 63 15 37 71 56 22 29 67 89 8 14 31 12 55 84 84 87 17 45 30 25 92 49 47 100 16 63 100 18 70 0 81 75 98 19 -2 64 90 88 14 87 89 36 16 77 16 0 92 34 14 48 17 63 25 56 85 0 97 84 99 73 78 86 43 2 45 4 79 12 66 63 72 82 68 54 -2 35 12 37 12 56 65 3 10 26 26 92 77 15 40 19 46 72 43 92 52 90 21 79 57 64 99 14 56 47 85 1 79 62 14 9 85 72 48 77 10 19 9 21 64 41 48 4 55 2 -1 18 13 24 66 48 94 85 71 47 73 39 23 30 25 13 59 34 96 47 37 38 1 5 22 92 43 12 3 90 87 99 3 52 21 89 59 6 89 88 94 57 6 79 12 18 94 31 25 27 77 43 6 50 40 67 43 1 73 68 80 49 66 -1 95 10 38 29 24 10 46 6 2 21 77 0 15 19 41 -3 17 10 42 17 -3 44 88 12 7 31 65 14 73 80 29 11 100 62 24 33 11 69 -1 64 14 100 24 62 48 91 78 5 26 44 99 13 90 11 89 13 20 19 24 86 100 99 63 82 85 45 23 59 98 98 65 56 59 47 2 34 88 -2 43 36 18 33 46 63 85 38 33 83 16 29 14 93 54 52 31 6 78 87 17 75 100 77 59 36 29 90 77 53 48 48 2 32 92 56 8 25 75 26 47 89 3 81 43 40 -1 33 70 47 43 55 -2 70 49 3 40 51 30 86 25 26 23 62 56 97 83 74 18 46 66 58 56 10 -2 76 93 73 48 33 29 33 48 73 36 100 2 28 55 19 0 37 50 66 28 13 50 46 83 -3 58 40 46 61 72 45 42 7 49 90 35 66 4 60 68 64 19 2 81 28 70 52 18 100 20 1 71 77 65 53 49 70 39 28 89 88 75 60 8 11 -3 0 96 69 63 73 97 60 49 82 -1 0 19 93 62 100 13 18 -2 60 -1 8 77 99 51 75 15 76 63 30 36 20 60 63 15 3 86 45 90 100 16 32 31 24 5 56 96 53 31 51 99 46 31 23 18 77 23 11 52 86 57 53 54 73 17 7 33 8 86 44 24 94 34 35 53 79 98 74 81 47 53 14 79 41 19 5 65 72 70 1 99 23 24 18 6 13 90 52 87 47 62 50 72 17 18 56 8 25 64 21 95 12 19 69 31 92 59 8 44 82 0 82 13 78 92 95 76 44 16 75 20 4 59 34 18 40 46 38 60 69 61 21 57 9 59 86 48 24 34 38 16 52 98 1 87 51 89 30 37 -3 6 6 34 44 75 93 33 49 1 70 52 43 78 65 33 39 91 94 2 0 55 77 31 88 63 38 11 33 66 11 -3 11 23 99 27 5 99 97 44 51 2 30 94 84 0 67 88 22 56 62 90 6 74 39 79 96 86 76 50 5 -2 6 4 11 70 87 40 88 33 30 36 45 5 43 10 42 59 41 92 82 28 76 77 78 14 93 5 3 82 18 41 34 70 92 1 77 75 100 18 80 5 67 79 61 76 91 4 33 71 74 39 28 6 98 35 19 25 59 77 26 24 79 45 79 69 93 53 69 37 9 50 64 38 33 15 31 56 35 30 89 62 -2 39 71 31 74 61 2 90 45 44 43 63 42 52 92 100 96 14 93 38 20 65 31 38 95 52 6 63 99 50 87 24 30 0 79 41 48 7 24 44 60 98 43 -1 49 71 86 33 17 50 80 46 79 76 66 81 12 79 36 81 23 28 6 56 75 7 31 25 85 0 59 32 55 54 53 46 21 83 97 68 63 79 48 80 69 6 65 -2 36 91 98 86 31 6 63 52 5 26 80 80 29 2 51 75 78 37 51 26 10 31 21 71 84 43 32 90 48 94 11 62 4 90 54 94 41 45 53 65 11 60 15 85 32 86 46 48 34 6 18 15 -2 20 61 31 67 40 13 82 39 67 -1 100 17 83 44 77 56 94 75 99 83 53 65 5 59 45 63 62 60 62 29 70 70 72 48 95 82 12 59 73 55 66 79 41 37 59 40 49 51 -2 92 44 43 94 34 79 64 21 89 82 86 83 87 91 86 78 49 59 4 66 66 89 60 61 40 21 5 47 20 30 96 35 63 55 5 59 54 30 63 22 49 78 32 2 22 14 -2 6 69 8 53 18 14 75 3 23 95 38 55 40 1 37 64 2 57 59 56 61 99 40 85 35 42 57 72 8 0 11 46 71 70 19 75 24 91 91 64 21 14 54 8 58 32 37 95 12 90 32 24 37 12 12 38 70 23 60 78 62 54 21 48 48 58 95 99 97 86 36 58 6 36 56 22 14 25 8 18 93 31 44 14 95 67 59 58 11 25 19 90 54 31 29 98 -2 34 25 2 70 96 50 32 19 63 17 36 23 12 35 24 22 40 70 8 98 62 94 23 62 9 78 34 86 75 39 99 57 33 93 34 6 97 97 38 65 45 47 18 80 57 6 14 43 85 16 0 100 89 87 35 78 15 47 44 5 7 83 84 97 88 46 20 47 76 40 66 27 42 92 75 4 19 57 100 6 3 88 43 15 66 96 47 42 91 71 36 51 -1 38 41 8 77 62 25 3 -1 77 1 54 5 36 46 38 43 39 54 95 19 86 18 23 31 63 65 63 26 3 93 18 16 48 88 40 29 75 99 1 63 72 63 18 25 27 61 99 31 23 -3 98 40 100 72 88 97 -3 85 51 11 75 13 15 100 53 44 38 26 39 36 68 27 98 30 33 60 31 36 81 41 7 73 69 37 100 90 43 76 78 21 91 74 18 73 66 8 56 2 94 91 21 88 49 8 77 21 85 68 53 24 -2 80 28 54 43 15 49 62 -3 37 60 63 94 49 3 38 90 93 11 84 99 79 67 24 96 92 81 57 48 11 15 40 27 71 100 68 100 87 20 99 40 57 38 85 27 55 1 90 91 57 21 0 61 -2 69 3 65 46 17 54 56 25 13 50 32 32 38 17 60 34 25 50 78 67 96 -2 31 23 12 2 34 85 85 10 59 17 48 8 32 84 84 14 18 39 10 38 16 6 47 79 40 58 48 54 91 98 42 81 100 16 49 -1 43 68 83 88 8 64 62 91 41 66 96 70 95 21 63 25 17 72 73 91 0 54 57 1 74 9 25 8 54 40 60 0 46 3 12 47 73 45 58 46 35 31 54 73 54 62 27 60 52 61 71 82 95 12 56 91 55 87 52 87 4 21 34 13 21 46 37 87 70 50 86 45 2 20 52 83 67 28 53 39 31 92 55 32 9 39 33 60 57 82 21 24 78 21 55 33 94 82 93 26 51 82 46 84 21 -2 97 36 29 47 9 68 8 12 61 27 24 9 57 65 20 3 37 36 -3 82 92 78 36 70 11 44 24 20 10 50 82 61 58 -1 56 61 87 93 33 30 85 81 22 79 91 7 55 26 50 93 58 41 8 99 20 94 60 84 17 44 41 77 38 89 83 51 38 11 53 36 93 60 13 90 50 2 3 7 14 4 81 19 46 46 20 53 73 56 23 50 54 81 51 47 51 75 58 6 45 72 81 58 94 22 6 51 31 66 69 98 9 69 62 83 32 0 76 73 23 100 92 96 57 69 85 56 34 75 45 17 14 35 42 91 79 76 -2 2 29 54 11 96 67 36 79 91 67 0 60 100 67 17 49 98 74 41 42 1 35 24 73 96 60 29 35 -2 16 41 18 9 69 51 2 58 52 28 65 51 37 24 41 11 85 73 2 34 57 3 64 98 54 49 8 89 27 58 40 2 29 94 73 82 70 59 85 72 10 47 18 81 14 46 86 20 33 69 20 11 81 54 97 79 0 54",
"expected": "109",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-C4",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u4.s1",
"difficulty": "medium",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "C4 · Second Best",
"prompt": "Print the second largest **distinct** value among `n` integers, or `-1` if it doesn't exist. Do it in one pass without sorting.\n\n(Values can be negative, so `-1` itself can't be confused: print the word `NONE` instead.)",
"inputFormat": "Line 1: n. Line 2: n integers.",
"outputFormat": "One integer, or NONE.",
"constraints": "1 ≤ n ≤ 10^5, |a_i| ≤ 10^9",
"steps": [],
"sampleInput": "5\n3 8 1 9 4",
"sampleOutput": "8",
"starter": "# read input with input(), print the answer\n",
"reference": "n = int(input())\na = list(map(int, input().split()))\nfirst = None\nsecond = None\nfor x in a:\n    if first is None or x > first:\n        if first is not None:\n            second = first\n        first = x\n    elif x != first and (second is None or x > second):\n        second = x\nprint(second if second is not None else \"NONE\")\n",
"hints": [
"Track first (largest) and second (largest value smaller than first).",
"When x beats first, the old first becomes second. When x is strictly between, it becomes second. When x == first, ignore it.",
"Don't start trackers at 0 — all-negative input breaks that. Start them at None."
],
"explanation": "Concepts: for-each, two trackers, duplicates, negatives",
"tests": [
{
"input": "5\n3 8 1 9 4",
"expected": "8",
"category": "basic",
"hidden": false
},
{
"input": "3\n7 7 7",
"expected": "NONE",
"category": "normal",
"hidden": false
},
{
"input": "4\n-5 -2 -9 -2",
"expected": "-5",
"category": "normal",
"hidden": false
},
{
"input": "1\n5",
"expected": "NONE",
"category": "edge",
"hidden": true
},
{
"input": "2\n1 2",
"expected": "1",
"category": "edge",
"hidden": true
},
{
"input": "2\n2 1",
"expected": "1",
"category": "edge",
"hidden": true
},
{
"input": "5\n9 9 8 8 7",
"expected": "8",
"category": "edge",
"hidden": true
},
{
"input": "3\n-1 -1 -2",
"expected": "-2",
"category": "edge",
"hidden": true
},
{
"input": "4\n0 0 -1 0",
"expected": "-1",
"category": "edge",
"hidden": true
},
{
"input": "6\n5 1 5 3 5 4",
"expected": "4",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-C5",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u5.s5",
"difficulty": "medium",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "C5 · Perfect Numbers in a Range",
"prompt": "A number is *perfect* if it equals the sum of its proper divisors (all divisors except itself). For example 6 = 1 + 2 + 3.\n\nPrint all perfect numbers in `[L, R]` on one line, or `-1` if there are none.",
"inputFormat": "One line: L R.",
"outputFormat": "Numbers separated by spaces, or -1.",
"constraints": "1 ≤ L ≤ R ≤ 10^4",
"steps": [],
"sampleInput": "1 30",
"sampleOutput": "6 28",
"starter": "# read input with input(), print the answer\n",
"reference": "l, r = map(int, input().split())\nres = []\nfor n in range(l, r + 1):\n    if n == 1:\n        continue\n    s = 1\n    d = 2\n    while d * d <= n:\n        if n % d == 0:\n            s += d\n            if d != n // d:\n                s += n // d\n        d += 1\n    if s == n:\n        res.append(str(n))\nprint(\" \".join(res) if res else -1)\n",
"hints": [
"Outer loop: every n from L to R. Inner loop: add up n's divisors.",
"Proper divisors exclude n itself. 1 has no proper divisors, so its sum is 0, not 1.",
"Pair divisors: if d divides n, so does n // d. Looping d while d * d <= n is much faster — don't double-count when d == n // d."
],
"explanation": "Concepts: nested loops, for + while, divisor sum",
"tests": [
{
"input": "1 30",
"expected": "6 28",
"category": "basic",
"hidden": false
},
{
"input": "7 27",
"expected": "-1",
"category": "normal",
"hidden": false
},
{
"input": "1 10000",
"expected": "6 28 496 8128",
"category": "normal",
"hidden": false
},
{
"input": "1 1",
"expected": "-1",
"category": "edge",
"hidden": true
},
{
"input": "6 6",
"expected": "6",
"category": "edge",
"hidden": true
},
{
"input": "28 28",
"expected": "28",
"category": "edge",
"hidden": true
},
{
"input": "29 495",
"expected": "-1",
"category": "edge",
"hidden": true
},
{
"input": "496 8128",
"expected": "496 8128",
"category": "edge",
"hidden": true
},
{
"input": "8129 10000",
"expected": "-1",
"category": "edge",
"hidden": true
},
{
"input": "1 5",
"expected": "-1",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-C6",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u5.s5",
"difficulty": "medium",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "C6 · Pair Sum Count",
"prompt": "Count the pairs of positions `(i, j)` with `i < j` such that `a[i] + a[j] == k`.",
"inputFormat": "Line 1: n k. Line 2: n integers.",
"outputFormat": "One integer.",
"constraints": "1 ≤ n ≤ 300, |a_i|, |k| ≤ 10^9",
"steps": [],
"sampleInput": "5 6\n1 5 3 3 2",
"sampleOutput": "2",
"starter": "# read input with input(), print the answer\n",
"reference": "n, k = map(int, input().split())\na = list(map(int, input().split()))\nc = 0\nfor i in range(n):\n    for j in range(i + 1, n):\n        if a[i] + a[j] == k:\n            c += 1\nprint(c)\n",
"hints": [
"Two loops: i over every position, j over every position after i.",
"Starting j at 0 counts each pair twice and also pairs an element with itself.",
"range(i + 1, n) for the inner loop gives exactly the pairs with i < j."
],
"explanation": "Concepts: nested for, j starts at i + 1, counting",
"tests": [
{
"input": "5 6\n1 5 3 3 2",
"expected": "2",
"category": "basic",
"hidden": false
},
{
"input": "4 2\n1 1 1 1",
"expected": "6",
"category": "normal",
"hidden": false
},
{
"input": "3 10\n1 2 3",
"expected": "0",
"category": "normal",
"hidden": false
},
{
"input": "1 2\n1",
"expected": "0",
"category": "edge",
"hidden": true
},
{
"input": "2 0\n-5 5",
"expected": "1",
"category": "edge",
"hidden": true
},
{
"input": "6 0\n0 0 0 0 0 0",
"expected": "15",
"category": "edge",
"hidden": true
},
{
"input": "5 -2\n-1 -1 0 -2 2",
"expected": "2",
"category": "edge",
"hidden": true
},
{
"input": "300 0\n15 12 11 -1 1 -4 16 -12 15 20 -4 0 -12 -12 -10 1 -19 20 -4 -6 0 -15 16 8 7 -18 -3 -8 -2 -7 15 -15 8 -11 -15 5 14 -8 18 19 1 4 12 -14 7 -9 -16 -19 -4 12 -13 -17 -5 0 -9 -2 10 12 8 3 -8 -18 -18 2 -18 -9 19 11 20 9 3 8 -1 12 14 10 14 -15 -18 -16 -20 12 -14 -18 -12 -8 -12 -18 19 -7 -17 7 3 -3 11 11 -15 -12 -5 11 7 -10 14 11 -9 -18 -3 2 -5 -8 -16 5 -13 13 15 -14 -4 -1 -8 -8 8 5 -19 -18 -15 -10 -15 -9 20 -17 4 4 7 -13 -11 -20 0 1 16 20 -6 -11 15 -12 1 -19 11 -17 -15 -4 6 3 8 6 -16 -12 7 2 -12 -4 16 -15 -8 15 -14 -13 -3 4 -9 -18 -7 -10 1 12 14 -5 -12 10 -14 4 -8 -7 17 -12 14 1 -14 -18 -17 -10 16 -2 19 -9 -2 -1 -10 -13 -3 -5 -13 -6 0 10 10 -11 -14 -20 15 -5 1 8 16 16 17 5 -13 19 0 -8 -17 18 1 3 -11 -13 -14 -15 -13 6 12 11 -12 15 20 0 -4 -18 -14 0 6 9 -9 -14 7 -13 -16 -9 -14 -13 5 15 -4 -2 2 2 15 20 -4 20 -16 19 1 11 -17 13 -8 -3 -19 19 14 -6 17 -1 -6 20 17 -1 19 -16 20 -14 17 -20 11 -19 -16 -4 10 14 -4 17 17 -12 -18 -2 -19 -2 17 -16",
"expected": "1035",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-D1",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u5.s5",
"difficulty": "easy",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "D1 · Hollow Frame",
"prompt": "Print an `r × c` frame: cells on the border are `#`, inside cells are `.`.",
"inputFormat": "One line: r c.",
"outputFormat": "r lines of c characters.",
"constraints": "1 ≤ r, c ≤ 50",
"steps": [],
"sampleInput": "4 5",
"sampleOutput": "#####\n#...#\n#...#\n#####",
"starter": "# read input with input(), print the answer\n",
"reference": "r, c = map(int, input().split())\nfor i in range(r):\n    row = \"\"\n    for j in range(c):\n        if i == 0 or i == r - 1 or j == 0 or j == c - 1:\n            row += \"#\"\n        else:\n            row += \".\"\n    print(row)\n",
"hints": [
"Build each row cell by cell: decide # or . from the position (i, j).",
"A cell is on the border if i == 0 or i == r - 1 or j == 0 or j == c - 1.",
"Shortcut solutions break on 1-row or 1-column frames — test 1 3 and 3 1."
],
"explanation": "Concepts: nested loops, border condition, patterns",
"tests": [
{
"input": "4 5",
"expected": "#####\n#...#\n#...#\n#####",
"category": "basic",
"hidden": false
},
{
"input": "1 3",
"expected": "###",
"category": "normal",
"hidden": false
},
{
"input": "3 1",
"expected": "#\n#\n#",
"category": "normal",
"hidden": false
},
{
"input": "1 1",
"expected": "#",
"category": "edge",
"hidden": true
},
{
"input": "2 2",
"expected": "##\n##",
"category": "edge",
"hidden": true
},
{
"input": "2 5",
"expected": "#####\n#####",
"category": "edge",
"hidden": true
},
{
"input": "5 2",
"expected": "##\n##\n##\n##\n##",
"category": "edge",
"hidden": true
},
{
"input": "50 50",
"expected": "##################################################\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n#................................................#\n##################################################",
"category": "edge",
"hidden": true
},
{
"input": "3 3",
"expected": "###\n#.#\n###",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-D2",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u5.s5",
"difficulty": "medium",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "D2 · Number Pyramid",
"prompt": "Print a centred number pyramid of height `n`. Row `i` (1-based) has `n - i` leading spaces, then the numbers 1, 2, …, i, then i - 1, …, 1 written **without spaces**. Print no trailing spaces.\n\n(Only n ≤ 9, so every number is one digit.)",
"inputFormat": "One integer n.",
"outputFormat": "n lines.",
"constraints": "1 ≤ n ≤ 9",
"steps": [],
"sampleInput": "3",
"sampleOutput": "  1\n 121\n12321",
"starter": "# read input with input(), print the answer\n",
"reference": "n = int(input())\nfor i in range(1, n + 1):\n    line = \" \" * (n - i)\n    for j in range(1, i + 1):\n        line += str(j)\n    for j in range(i - 1, 0, -1):\n        line += str(j)\n    print(line)\n",
"hints": [
"Each row has three parts: spaces, an increasing run, a decreasing run.",
"Spaces: n - i. Up: range(1, i + 1). Down: range(i - 1, 0, -1).",
"Starting the downward run at i repeats the middle digit (1221 instead of 121)."
],
"explanation": "Concepts: nested loops, spaces, up then down",
"tests": [
{
"input": "3",
"expected": "  1\n 121\n12321",
"category": "basic",
"hidden": false
},
{
"input": "1",
"expected": "1",
"category": "normal",
"hidden": false
},
{
"input": "5",
"expected": "    1\n   121\n  12321\n 1234321\n123454321",
"category": "normal",
"hidden": false
},
{
"input": "2",
"expected": " 1\n121",
"category": "edge",
"hidden": true
},
{
"input": "4",
"expected": "   1\n  121\n 12321\n1234321",
"category": "edge",
"hidden": true
},
{
"input": "9",
"expected": "        1\n       121\n      12321\n     1234321\n    123454321\n   12345654321\n  1234567654321\n 123456787654321\n12345678987654321",
"category": "edge",
"hidden": true
},
{
"input": "6",
"expected": "     1\n    121\n   12321\n  1234321\n 123454321\n12345654321",
"category": "edge",
"hidden": true
}
],
"compare": "exact"
},
{
"id": "loops-D3",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u5.s5",
"difficulty": "medium",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "D3 · Multiplication Grid Lookup",
"prompt": "Look at the `n × n` multiplication grid where cell `(i, j)` holds `i * j` (1-based). Scanning row by row from top-left, find the **first** cell whose value equals `v`. Print its row and column, or `-1` if `v` never appears.",
"inputFormat": "One line: n v.",
"outputFormat": "i j, or -1.",
"constraints": "1 ≤ n ≤ 1000, 1 ≤ v ≤ 10^6",
"steps": [],
"sampleInput": "5 12",
"sampleOutput": "3 4",
"starter": "# read input with input(), print the answer\n",
"reference": "n, v = map(int, input().split())\nans = None\nfor i in range(1, n + 1):\n    for j in range(1, n + 1):\n        if i * j == v:\n            ans = (i, j)\n            break\n    if ans:\n        break\nprint(*ans) if ans else print(-1)\n",
"hints": [
"Nested loops over i and j; stop when i * j == v.",
"break only exits the inner loop. You need a flag (or the found answer) to break the outer loop too.",
"Without the outer break, a later row overwrites your answer — scanning 1000 × 1000 for 1000 shows it."
],
"explanation": "Concepts: nested loops, break out of both, flag",
"tests": [
{
"input": "5 12",
"expected": "3 4",
"category": "basic",
"hidden": false
},
{
"input": "5 7",
"expected": "-1",
"category": "normal",
"hidden": false
},
{
"input": "10 1",
"expected": "1 1",
"category": "normal",
"hidden": false
},
{
"input": "1 1",
"expected": "1 1",
"category": "edge",
"hidden": true
},
{
"input": "1 2",
"expected": "-1",
"category": "edge",
"hidden": true
},
{
"input": "1000 1000000",
"expected": "1000 1000",
"category": "edge",
"hidden": true
},
{
"input": "1000 999999",
"expected": "-1",
"category": "edge",
"hidden": true
},
{
"input": "1000 997",
"expected": "1 997",
"category": "edge",
"hidden": true
},
{
"input": "6 36",
"expected": "6 6",
"category": "edge",
"hidden": true
},
{
"input": "1000 1000",
"expected": "1 1000",
"category": "edge",
"hidden": true
}
]
},
{
"id": "loops-D4",
"type": "coding",
"lang": "python",
"subject": "python",
"topicId": "python.mid.u5.s7",
"difficulty": "easy",
"marks": 10,
"negative": 0,
"source": "seed",
"pack": "loops-v1",
"title": "D4 · FizzBuzz Matrix",
"prompt": "Print an `r × c` grid. Cell `(i, j)` (1-based) holds `v = i * j`. Print `FB` if v is divisible by 15, `F` if by 3, `B` if by 5, otherwise v itself. Separate cells by single spaces.",
"inputFormat": "One line: r c.",
"outputFormat": "r lines.",
"constraints": "1 ≤ r, c ≤ 30",
"steps": [],
"sampleInput": "3 5",
"sampleOutput": "1 2 F 4 B\n2 4 F 8 B\nF F F F FB",
"starter": "# read input with input(), print the answer\n",
"reference": "r, c = map(int, input().split())\nfor i in range(1, r + 1):\n    row = []\n    for j in range(1, c + 1):\n        v = i * j\n        if v % 15 == 0:\n            row.append(\"FB\")\n        elif v % 3 == 0:\n            row.append(\"F\")\n        elif v % 5 == 0:\n            row.append(\"B\")\n        else:\n            row.append(str(v))\n    print(\" \".join(row))\n",
"hints": [
"Nested loops build each row as a list, then print it with \" \".join(row).",
"Order of checks matters: a multiple of 15 is also a multiple of 3.",
"Check 15 first, then 3, then 5, otherwise the number."
],
"explanation": "Concepts: nested loops, if-elif order, grid",
"tests": [
{
"input": "3 5",
"expected": "1 2 F 4 B\n2 4 F 8 B\nF F F F FB",
"category": "basic",
"hidden": false
},
{
"input": "1 1",
"expected": "1",
"category": "normal",
"hidden": false
},
{
"input": "5 3",
"expected": "1 2 F\n2 4 F\nF F F\n4 8 F\nB B FB",
"category": "normal",
"hidden": false
},
{
"input": "15 15",
"expected": "1 2 F 4 B F 7 8 F B 11 F 13 14 FB\n2 4 F 8 B F 14 16 F B 22 F 26 28 FB\nF F F F FB F F F F FB F F F F FB\n4 8 F 16 B F 28 32 F B 44 F 52 56 FB\nB B FB B B FB B B FB B B FB B B FB\nF F F F FB F F F F FB F F F F FB\n7 14 F 28 B F 49 56 F B 77 F 91 98 FB\n8 16 F 32 B F 56 64 F B 88 F 104 112 FB\nF F F F FB F F F F FB F F F F FB\nB B FB B B FB B B FB B B FB B B FB\n11 22 F 44 B F 77 88 F B 121 F 143 154 FB\nF F F F FB F F F F FB F F F F FB\n13 26 F 52 B F 91 104 F B 143 F 169 182 FB\n14 28 F 56 B F 98 112 F B 154 F 182 196 FB\nFB FB FB FB FB FB FB FB FB FB FB FB FB FB FB",
"category": "edge",
"hidden": true
},
{
"input": "1 30",
"expected": "1 2 F 4 B F 7 8 F B 11 F 13 14 FB 16 17 F 19 B F 22 23 F B 26 F 28 29 FB",
"category": "edge",
"hidden": true
},
{
"input": "30 1",
"expected": "1\n2\nF\n4\nB\nF\n7\n8\nF\nB\n11\nF\n13\n14\nFB\n16\n17\nF\n19\nB\nF\n22\n23\nF\nB\n26\nF\n28\n29\nFB",
"category": "edge",
"hidden": true
},
{
"input": "2 2",
"expected": "1 2\n2 4",
"category": "edge",
"hidden": true
},
{
"input": "7 11",
"expected": "1 2 F 4 B F 7 8 F B 11\n2 4 F 8 B F 14 16 F B 22\nF F F F FB F F F F FB F\n4 8 F 16 B F 28 32 F B 44\nB B FB B B FB B B FB B B\nF F F F FB F F F F FB F\n7 14 F 28 B F 49 56 F B 77",
"category": "edge",
"hidden": true
}
]
}
] }]);
