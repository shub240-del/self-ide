/* ExamForge IDE — default (seed) configuration.
   Everything here is editable from "Exam Setup" inside the app and is stored per student.
   Nothing in this file is "official" unless the institution supplied it: exam patterns
   below are PRACTICE BLUEPRINTS and are labelled as such in the UI. */
(function () {
  const SYLLABUS = {
    math: {
      mid: [
        ["Part A — Bridge", "Numbers and Reasoning", ["Word Problems decoding", "Number Theory and Mental Math"]],
        ["Part A — Bridge", "Patterns and Counting", ["Sequences and Patterns", "Counting and Binomial Theorem"]],
        ["Part A — Bridge", "Calculus", ["Functions", "Differential Calculus", "Integral Calculus"]],
        ["Part A — Bridge", "Probability and Statistics", ["Set Theory and Probability", "Descriptive Statistics"]],
        ["Part A — Bridge", "Linear Algebra", ["Vectors", "Matrices"]],
        ["Part B — Logic and Digital Design", "Logic", ["Propositional Logic and Boolean Algebra", "Rules of Inference and Predicate Logic"]],
        ["Part B — Logic and Digital Design", "Digital Logic", ["Karnaugh Maps and Boolean Minimization", "Logic Circuit Design and Applications"]],
      ],
      ut2: [
        ["", "Boolean Logic", ["Karnaugh Maps", "Boolean Minimization"]],
        ["", "Set Theory", ["Set Theory", "Relations and Functions", "Countability"]],
        ["", "Proofs", ["Introduction to Proofs", "Direct Proofs", "Proof by Cases", "Proof by Contradiction", "Proof by Contrapositive"]],
        ["", "Combinatorics", ["Advanced Combinatorics"]],
      ],
    },
    python: {
      mid: [
        ["", "Programming Foundations", ["What a program is", "Programming languages and syntax", "Problem-solving approach", "Pseudocode"]],
        ["", "Python Basics", ["Python execution", "Variables and data types", "Operators", "Type conversion", "Syntax and runtime errors", "Built-in functions and standard modules"]],
        ["", "Logic and Number Systems", ["Comparisons and Boolean conditions", "Binary, decimal and hexadecimal", "Bit operations", "Floating-point representation", "Code readability"]],
        ["", "Collections, Input/Output and Decisions", ["Collections", "Strings", "User input and output", "Conditional statements", "Edge cases and problem decomposition"]],
        ["", "Loops and Working with Data", ["Loops", "Running totals and counters", "Digit-based problems", "GCD and LCM", "Nested loops", "Structured input", "Grids and dictionaries"]],
      ],
      ut2: [
        ["", "Loops and Iteration", ["Loops and Iteration"]],
        ["", "Working with Numbers", ["GCD and LCM", "Series and number families", "Step-by-step problem solving"]],
        ["", "Patterns and Grids", ["Pattern printing", "Rows and columns", "Matrix operations"]],
        ["", "Strings", ["String manipulation", "Slicing and rebuilding", "Pattern matching"]],
      ],
    },
    fs: {
      mid: [
        ["", "Software Engineering Basics", ["What happens between entering a URL and viewing a webpage", "Web application components", "Command line", "Version control", "Collaboration and Git"]],
        ["", "HTML", ["Document structure", "Semantic elements", "Page organisation", "Links", "Media", "Embedded content", "Forms"]],
        ["", "CSS Basics", ["CSS application methods", "Selectors", "Cascade and specificity", "Typography", "Colours and backgrounds", "Box model", "CSS units"]],
        ["", "CSS Layout", ["Positioning", "Flexbox", "Grid", "Alignment", "Spacing", "Landing-page construction"]],
        ["", "Responsive Layout", ["Content responsiveness", "Media queries", "Mobile and tablet layouts", "Responsive design approaches"]],
      ],
      ut2: [
        ["", "JavaScript Basics", ["Variables", "Data types", "Operators", "String concatenation", "Variable declarations", "Conditions", "Loops", "Input and output"]],
        ["", "Objects and Arrays", ["CRUD operations", "Arrays and objects", "Arrays of objects", "Copying data", "Equality", "Spread syntax", "Array methods"]],
        ["", "Functions", ["Function creation and execution", "Scope and execution context", "Callbacks", "Higher-order functions"]],
        ["", "Browser and DOM", ["Browser console", "Browser APIs", "Page URL", "Element selection", "DOM traversal", "Modifying content and styles", "Creating elements dynamically"]],
        ["", "Events and Forms", ["Event handling", "Form submission", "Reading user input", "Rendering data"]],
        ["", "Asynchronous JavaScript", ["Delays", "Event loop", "Promises", "Success and error handling", "API calls", "Async/await", "Rendering data from API responses"]],
      ],
    },
  };
  const TYPES = { math: ["mcq", "msq", "numerical", "subjective"], python: ["mcq", "output", "coding", "debug"], fs: ["mcq", "output", "coding", "web"] };

  function buildSyllabus() {
    const units = [];
    for (const subj in SYLLABUS) for (const cyc in SYLLABUS[subj]) {
      SYLLABUS[subj][cyc].forEach(([group, title, subs], i) => {
        units.push({
          id: `${subj}.${cyc}.u${i + 1}`, subject: subj, cycle: cyc, group, title,
          subtopics: subs.map((s, j) => ({ id: `${subj}.${cyc}.u${i + 1}.s${j + 1}`, title: s, objectives: [], difficulty: "medium", types: TYPES[subj].slice() })),
        });
      });
    }
    return units;
  }

  const bp = (label, type, count, marks, negative = 0) => ({ label, type, count, marks, negative, topics: [], difficulty: "any" });
  const EXAMS = [
    { id: "ex-py-mid", subject: "python", cycle: "mid", date: "2026-11-16", time: "", durationMin: 90, official: false, notes: "",
      pattern: [bp("Section A — MCQ & output", "mcq", 10, 1), bp("Section B — Coding", "coding", 2, 10), bp("Section C — Debugging", "debug", 1, 5)] },
    { id: "ex-fs-mid", subject: "fs", cycle: "mid", date: "2026-11-17", time: "", durationMin: 90, official: false, notes: "",
      pattern: [bp("Section A — MCQ", "mcq", 10, 1), bp("Section B — HTML/CSS lab", "web", 1, 20)] },
    { id: "ex-math-mid", subject: "math", cycle: "mid", date: "2026-11-18", time: "", durationMin: 90, official: false, notes: "",
      pattern: [bp("Section A — MCQ", "mcq", 8, 1), bp("Section B — Numerical", "numerical", 5, 2), bp("Section C — Subjective", "subjective", 2, 6)] },
    { id: "ex-py-ut2", subject: "python", cycle: "ut2", date: "2026-11-23", time: "", durationMin: 60, official: false, notes: "",
      pattern: [bp("Section A — MCQ & output", "mcq", 6, 1), bp("Section B — Coding", "coding", 2, 10)] },
    { id: "ex-fs-ut2", subject: "fs", cycle: "ut2", date: "2026-11-25", time: "", durationMin: 60, official: false, notes: "",
      pattern: [bp("Section A — MCQ", "mcq", 6, 1), bp("Section B — JavaScript coding", "coding", 2, 8), bp("Section C — DOM / practical", "web", 1, 15)] },
    { id: "ex-math-ut2", subject: "math", cycle: "ut2", date: "2026-11-26", time: "", durationMin: 60, official: false, notes: "",
      pattern: [bp("Section A — MCQ", "mcq", 6, 1), bp("Section B — Numerical", "numerical", 3, 2), bp("Section C — Proofs", "subjective", 2, 6)] },
  ];

  /* ---------------- Question bank ---------------- */
  const Q = [];
  let n = 0;
  const add = (o) => Q.push(Object.assign({ id: "seed-" + (++n), difficulty: "medium", marks: 1, negative: 0, hints: [], source: "seed", explanation: "" }, o));
  const mcq = (subject, topicId, prompt, options, answer, explanation, extra = {}) =>
    add(Object.assign({ type: "mcq", subject, topicId, prompt, options, answer, explanation }, extra));

  /* ---- Python MCQ / output ---- */
  mcq("python", "python.mid.u2.s2", "What does this print?\n```python\nprint(type(3 / 2))\n```", ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'decimal'>"], 1,
    "In Python 3 the `/` operator always performs true division and returns a float, even for two ints. Use `//` for floor division.", { difficulty: "easy" });
  mcq("python", "python.mid.u2.s3", "Predict the output:\n```python\nprint(7 // 2, 7 % 2, -7 // 2)\n```", ["3 1 -3", "3 1 -4", "3.5 1 -3.5", "4 1 -4"], 1,
    "`//` floors towards negative infinity, so `-7 // 2` is `-4` (not `-3`). `7 % 2` is `1`.", { hints: ["Floor division rounds towards negative infinity, not towards zero.", "-3.5 floored is…?"] });
  mcq("python", "python.mid.u3.s4", "What does this print?\n```python\nprint(0.1 + 0.2 == 0.3)\n```", ["True", "False", "Error", "0.3"], 1,
    "0.1 and 0.2 cannot be represented exactly in binary floating point; the sum is 0.30000000000000004. Compare floats with a tolerance, e.g. `math.isclose`.");
  mcq("python", "python.mid.u3.s2", "Predict the output:\n```python\nprint(bin(10), hex(255))\n```", ["0b1010 0xff", "1010 ff", "0b1010 0xFF", "0b0101 0xff"], 0,
    "`bin()` prefixes `0b`, `hex()` prefixes `0x` and uses lowercase digits. 10 = 8 + 2 = 1010₂, 255 = FF₁₆.", { difficulty: "easy" });
  mcq("python", "python.mid.u3.s3", "Predict the output:\n```python\nprint(5 & 3, 5 | 3, 5 ^ 3)\n```", ["1 7 6", "1 7 2", "0 7 6", "8 15 6"], 0,
    "5 = 101₂, 3 = 011₂. AND = 001 = 1, OR = 111 = 7, XOR = 110 = 6.");
  mcq("python", "python.mid.u2.s5", "Which error does this raise?\n```python\nx = \"5\" + 3\n```", ["SyntaxError", "TypeError", "ValueError", "NameError"], 1,
    "The code is syntactically valid; at run time Python refuses to add `str` and `int`, raising `TypeError: can only concatenate str (not \"int\") to str`.", { difficulty: "easy" });
  mcq("python", "python.mid.u4.s1", "Predict the output:\n```python\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)\n```", ["[1, 2, 3]", "[1, 2, 3, 4]", "[4, 1, 2, 3]", "Error"], 1,
    "`b = a` copies the reference, not the list. Both names point to the same list object, so appending through `b` is visible through `a`.");
  mcq("python", "python.mid.u5.s1", "Trace the loop. What is printed?\n```python\ntotal = 0\nfor i in range(1, 10, 3):\n    total += i\nprint(total)\n```", ["12", "15", "22", "45"], 0,
    "`range(1, 10, 3)` yields 1, 4, 7 (10 is excluded). 1 + 4 + 7 = 12.", { hints: ["Write out the values that range(1, 10, 3) produces.", "The stop value 10 is never included."] });
  mcq("python", "python.ut2.u4.s2", "Predict the output:\n```python\ns = \"python\"\nprint(s[::-1][1:4])\n```", ["yth", "oht", "noh", "hto"], 1,
    "`s[::-1]` is `\"nohtyp\"`. Slicing `[1:4]` takes indices 1, 2, 3 → `\"oht\"`.");
  mcq("python", "python.mid.u2.s4", "What does this print?\n```python\nprint(int(\"12\") + float(\"1.5\"))\n```", ["121.5", "13.5", "13", "TypeError"], 1,
    "Both strings are converted to numbers first; int + float gives a float: 13.5.", { difficulty: "easy" });
  mcq("python", "python.mid.u3.s1", "What does this print?\n```python\nprint(3 < 5 > 4)\n```", ["True", "False", "SyntaxError", "None"], 0,
    "Python chains comparisons: `3 < 5 > 4` means `3 < 5 and 5 > 4`, which is True.");
  mcq("python", "python.mid.u5.s7", "Predict the output:\n```python\nd = {}\nfor ch in \"banana\":\n    d[ch] = d.get(ch, 0) + 1\nprint(d[\"a\"], len(d))\n```", ["3 3", "3 6", "2 3", "3 2"], 0,
    "Counts are b:1, a:3, n:2. `d[\"a\"]` is 3 and there are 3 distinct keys.");
  add({ type: "output", subject: "python", topicId: "python.ut2.u3.s1", difficulty: "easy",
    prompt: "Type the exact output of this program:\n```python\nfor i in range(1, 4):\n    print(\"*\" * i)\n```", answer: "*\n**\n***",
    explanation: "Row i prints i stars: 1, 2 and 3 stars on separate lines." });
  add({ type: "msq", subject: "python", topicId: "python.mid.u4.s1", prompt: "Select **all** immutable types.", options: ["tuple", "list", "str", "dict", "frozenset"], answer: [0, 2, 4], marks: 2,
    explanation: "tuple, str and frozenset cannot be changed after creation. list and dict are mutable." });

  /* ---- Python coding ---- */
  const T = (input, expected, category, hidden = false) => ({ input, expected, category, hidden });
  add({ type: "coding", lang: "python", subject: "python", topicId: "python.mid.u5.s3", marks: 10, title: "Sum of digits",
    prompt: "Read one integer `n` and print the sum of its digits. For a negative number, ignore the sign.",
    inputFormat: "A single integer n.", outputFormat: "A single integer — the digit sum.", constraints: "-10^18 ≤ n ≤ 10^18",
    steps: ["Read the input and convert it to int.", "Take the absolute value so the sign is ignored.", "Repeatedly add n % 10 and divide n by 10 with //, or iterate over the digits of str(n).", "Print the total."],
    sampleInput: "1234", sampleOutput: "10", complexity: "O(number of digits)",
    starter: "n = int(input())\n# your code here\n",
    reference: "n = abs(int(input()))\nprint(sum(int(d) for d in str(n)))\n",
    tests: [T("1234", "10", "basic"), T("900", "9", "normal"), T("7", "7", "basic"), T("0", "0", "edge"), T("-456", "15", "edge"),
      T("1000000000", "1", "boundary", true), T("999999999999999999", "162", "boundary", true), T("-9", "9", "edge", true)],
    hints: ["What does n % 10 give you? What does n // 10 do to n?", "Handle the sign first with abs().", "Loop while n > 0, adding n % 10 to a total each time. Remember 0 is a valid input."] });
  add({ type: "coding", lang: "python", subject: "python", topicId: "python.ut2.u2.s1", marks: 10, title: "GCD and LCM",
    prompt: "Read two positive integers `a` and `b` on one line and print their GCD and LCM separated by a space.",
    inputFormat: "One line: a b", outputFormat: "One line: gcd lcm", constraints: "1 ≤ a, b ≤ 10^9",
    steps: ["Split the line and convert both values to int.", "Compute the GCD with Euclid's algorithm (or math.gcd).", "Use lcm = a * b // gcd.", "Print both values."],
    sampleInput: "12 18", sampleOutput: "6 36", complexity: "O(log min(a, b))",
    starter: "a, b = map(int, input().split())\n# your code here\n",
    reference: "a, b = map(int, input().split())\nx, y = a, b\nwhile y:\n    x, y = y, x % y\nprint(x, a * b // x)\n",
    tests: [T("12 18", "6 36", "basic"), T("7 5", "1 35", "normal"), T("10 10", "10 10", "edge"), T("1 1", "1 1", "boundary"),
      T("21 6", "3 42", "normal", true), T("100000 75000", "25000 300000", "normal", true), T("17 289", "17 289", "edge", true), T("1000000000 999999999", "1 999999999000000000", "boundary", true)],
    hints: ["gcd(a, b) = gcd(b, a % b).", "Once you have the GCD, LCM follows from a × b = gcd × lcm.", "Loop: while b: a, b = b, a % b — but keep the original values for the LCM."] });
  add({ type: "coding", lang: "python", subject: "python", topicId: "python.ut2.u3.s1", marks: 10, title: "Number triangle",
    prompt: "Read `n` and print a number triangle: row `i` (1-based) contains the numbers 1 to i separated by single spaces.",
    inputFormat: "A single integer n.", outputFormat: "n lines.", constraints: "1 ≤ n ≤ 20",
    steps: ["Use an outer loop for rows 1..n.", "Use an inner loop (or join) to produce 1..i.", "Separate numbers with exactly one space and no trailing space."],
    sampleInput: "3", sampleOutput: "1\n1 2\n1 2 3",
    starter: "n = int(input())\n",
    reference: "n = int(input())\nfor i in range(1, n + 1):\n    print(' '.join(str(j) for j in range(1, i + 1)))\n",
    tests: [T("3", "1\n1 2\n1 2 3", "basic"), T("1", "1", "boundary"), T("5", "1\n1 2\n1 2 3\n1 2 3 4\n1 2 3 4 5", "normal"), T("2", "1\n1 2", "normal", true), T("4", "1\n1 2\n1 2 3\n1 2 3 4", "normal", true)] });
  add({ type: "coding", lang: "python", subject: "python", topicId: "python.ut2.u3.s3", marks: 10, title: "Matrix transpose", difficulty: "medium",
    prompt: "Read an r × c matrix and print its transpose.",
    inputFormat: "First line: r c. Then r lines, each with c integers.", outputFormat: "c lines, each with r integers separated by spaces.", constraints: "1 ≤ r, c ≤ 50",
    steps: ["Read r and c.", "Read r rows into a list of lists.", "Row j of the answer is column j of the input.", "Print each row joined by spaces."],
    sampleInput: "2 3\n1 2 3\n4 5 6", sampleOutput: "1 4\n2 5\n3 6",
    starter: "r, c = map(int, input().split())\nm = [list(map(int, input().split())) for _ in range(r)]\n",
    reference: "r, c = map(int, input().split())\nm = [list(map(int, input().split())) for _ in range(r)]\nfor j in range(c):\n    print(' '.join(str(m[i][j]) for i in range(r)))\n",
    tests: [T("2 3\n1 2 3\n4 5 6", "1 4\n2 5\n3 6", "basic"), T("1 1\n5", "5", "boundary"), T("3 1\n7\n8\n9", "7 8 9", "edge"), T("2 2\n-1 0\n3 -4", "-1 3\n0 -4", "edge", true), T("1 4\n1 2 3 4", "1\n2\n3\n4", "edge", true)] });
  add({ type: "coding", lang: "python", subject: "python", topicId: "python.ut2.u4.s3", marks: 10, title: "Clean palindrome",
    prompt: "Read a line of text. Ignoring case and every character that is not a letter or digit, print `YES` if it is a palindrome, otherwise `NO`.",
    inputFormat: "One line (may be empty).", outputFormat: "YES or NO", constraints: "Length ≤ 10^5",
    steps: ["Keep only characters where ch.isalnum() is True.", "Convert to lower case.", "Compare the cleaned string with its reverse."],
    sampleInput: "Racecar", sampleOutput: "YES",
    starter: "s = input()\n",
    reference: "s = input()\nt = ''.join(ch.lower() for ch in s if ch.isalnum())\nprint('YES' if t == t[::-1] else 'NO')\n",
    tests: [T("Racecar", "YES", "basic"), T("hello", "NO", "basic"), T("A man, a plan, a canal: Panama", "YES", "normal"), T("a", "YES", "boundary"), T("", "YES", "edge"),
      T("No 'x' in Nixon", "YES", "normal", true), T("ab", "NO", "edge", true), T("12321", "YES", "normal", true)] });
  add({ type: "coding", lang: "python", subject: "python", topicId: "python.ut2.u2.s2", marks: 10, title: "Fibonacci series",
    prompt: "Read `n` and print the first `n` Fibonacci numbers (starting 0 1) on one line separated by spaces.",
    inputFormat: "A single integer n.", outputFormat: "n integers on one line.", constraints: "1 ≤ n ≤ 90",
    steps: ["Start with a = 0, b = 1.", "Repeat n times: record a, then move a, b = b, a + b.", "Join the recorded numbers with spaces."],
    sampleInput: "7", sampleOutput: "0 1 1 2 3 5 8",
    starter: "n = int(input())\n",
    reference: "n = int(input())\na, b = 0, 1\nout = []\nfor _ in range(n):\n    out.append(a)\n    a, b = b, a + b\nprint(' '.join(map(str, out)))\n",
    tests: [T("7", "0 1 1 2 3 5 8", "basic"), T("1", "0", "boundary"), T("2", "0 1", "edge"), T("10", "0 1 1 2 3 5 8 13 21 34", "normal", true), T("90", "0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 1597 2584 4181 6765 10946 17711 28657 46368 75025 121393 196418 317811 514229 832040 1346269 2178309 3524578 5702887 9227465 14930352 24157817 39088169 63245986 102334155 165580141 267914296 433494437 701408733 1134903170 1836311903 2971215073 4807526976 7778742049 12586269025 20365011074 32951280099 53316291173 86267571272 139583862445 225851433717 365435296162 591286729879 956722026041 1548008755920 2504730781961 4052739537881 6557470319842 10610209857723 17167680177565 27777890035288 44945570212853 72723460248141 117669030460994 190392490709135 308061521170129 498454011879264 806515533049393 1304969544928657 2111485077978050 3416454622906707 5527939700884757 8944394323791464 14472334024676221 23416728348467685 37889062373143906 61305790721611591 99194853094755497 160500643816367088 259695496911122585 420196140727489673 679891637638612258 1100087778366101931 1779979416004714189", "boundary", true)] });
  add({ type: "coding", lang: "python", subject: "python", topicId: "python.mid.u4.s4", marks: 8, title: "Grade calculator", difficulty: "easy",
    prompt: "Read an integer mark and print the grade: 90–100 → `A`, 75–89 → `B`, 50–74 → `C`, 0–49 → `F`. Any mark outside 0–100 prints `Invalid`.",
    inputFormat: "A single integer.", outputFormat: "A, B, C, F or Invalid", constraints: "-1000 ≤ mark ≤ 1000",
    steps: ["Check the invalid range first.", "Then test boundaries from the highest grade down with if / elif.", "Test each boundary value (90, 89, 75, 74, 50, 49) yourself."],
    sampleInput: "82", sampleOutput: "B",
    starter: "m = int(input())\n",
    reference: "m = int(input())\nif m < 0 or m > 100:\n    print('Invalid')\nelif m >= 90:\n    print('A')\nelif m >= 75:\n    print('B')\nelif m >= 50:\n    print('C')\nelse:\n    print('F')\n",
    tests: [T("82", "B", "basic"), T("95", "A", "basic"), T("90", "A", "boundary"), T("89", "B", "boundary"), T("75", "B", "boundary"), T("74", "C", "boundary"),
      T("50", "C", "boundary", true), T("49", "F", "boundary", true), T("0", "F", "edge", true), T("100", "A", "edge", true), T("101", "Invalid", "edge", true), T("-1", "Invalid", "edge", true)] });
  add({ type: "coding", lang: "python", subject: "python", topicId: "python.mid.u5.s7", marks: 10, title: "Word frequency",
    prompt: "Read a sentence. Print each distinct word (lower-cased) with its count, one per line as `word count`, in order of first appearance. Words are separated by whitespace.",
    inputFormat: "One line of text.", outputFormat: "One `word count` pair per line.", constraints: "At least one word.",
    steps: ["Split on whitespace with split().", "Lower-case each word.", "Use a dict — insertion order is preserved in Python 3.7+.", "Print key and value."],
    sampleInput: "the cat and The dog", sampleOutput: "the 2\ncat 1\nand 1\ndog 1",
    starter: "words = input().split()\n",
    reference: "words = input().split()\nd = {}\nfor w in words:\n    w = w.lower()\n    d[w] = d.get(w, 0) + 1\nfor k, v in d.items():\n    print(k, v)\n",
    tests: [T("the cat and The dog", "the 2\ncat 1\nand 1\ndog 1", "basic"), T("hello", "hello 1", "boundary"), T("a A a", "a 3", "edge"), T("  spaced   out  words out ", "spaced 1\nout 2\nwords 1", "edge", true), T("x y z x y x", "x 3\ny 2\nz 1", "normal", true)] });

  /* ---- Python debugging ---- */
  add({ type: "debug", lang: "python", subject: "python", topicId: "python.mid.u5.s3", marks: 8, title: "Broken digit sum",
    prompt: "This program should print the sum of the digits of an integer (ignoring the sign). It gives wrong answers. Find the bug(s), explain them, and fix the code.",
    starter: "n = int(input())\ntotal = 0\nwhile n > 0:\n    total += n % 10\n    n = n / 10\nprint(total)\n",
    reference: "n = abs(int(input()))\ntotal = 0\nwhile n > 0:\n    total += n % 10\n    n = n // 10\nprint(total)\n",
    bugExplanation: "1) `n / 10` is true division, so n becomes a float (123.4, 12.34 …) and the loop adds fractional remainders; it must be `n // 10`. 2) Negative input is never processed because `n > 0` is False immediately — take `abs()` first.",
    tests: [T("1234", "10", "basic"), T("0", "0", "edge"), T("-456", "15", "edge"), T("900", "9", "normal", true), T("7", "7", "basic", true)] });
  add({ type: "debug", lang: "python", subject: "python", topicId: "python.ut2.u1.s1", marks: 6, title: "Off-by-one factorial", difficulty: "easy",
    prompt: "This program should print n! for a non-negative integer n. Find and fix the bug, and explain it.",
    starter: "n = int(input())\nfact = 1\nfor i in range(1, n):\n    fact = fact * i\nprint(fact)\n",
    reference: "n = int(input())\nfact = 1\nfor i in range(1, n + 1):\n    fact = fact * i\nprint(fact)\n",
    bugExplanation: "`range(1, n)` stops at n − 1, so the last factor is missing (5 gives 24 instead of 120). Use `range(1, n + 1)`.",
    tests: [T("5", "120", "basic"), T("0", "1", "edge"), T("1", "1", "boundary"), T("10", "3628800", "normal", true)] });
  add({ type: "debug", lang: "python", subject: "python", topicId: "python.ut2.u4.s1", marks: 6, title: "Reverse the words", compare: "exact",
    prompt: "This program should print the words of a line in reverse order, separated by single spaces with no leading/trailing spaces. Output is compared **exactly**. Fix it and explain the bug.",
    starter: "s = input()\nwords = s.split(\" \")\nresult = \"\"\nfor w in words:\n    result = w + \" \" + result\nprint(result)\n",
    reference: "s = input()\nprint(' '.join(reversed(s.split())))\n",
    bugExplanation: "Building `w + \" \" + result` leaves a trailing space, and `split(\" \")` creates empty strings for repeated spaces. Use `split()` (any whitespace) and `' '.join(reversed(words))`.",
    tests: [T("hello world", "world hello", "basic"), T("one", "one", "boundary"), T("a b c", "c b a", "normal"), T("  spaced   out  ", "out spaced", "edge", true)] });

  /* ---- Mathematics ---- */
  const num = (topicId, prompt, answer, explanation, extra = {}) => add(Object.assign({ type: "numerical", subject: "math", topicId, prompt, answer, tolerance: 0.001, marks: 2, explanation }, extra));
  mcq("math", "math.mid.u1.s2", "What is $\\operatorname{lcm}(12, 18, 30)$?", ["90", "180", "360", "60"], 1,
    "$12 = 2^2\\cdot3$, $18 = 2\\cdot3^2$, $30 = 2\\cdot3\\cdot5$. Take the highest powers: $2^2\\cdot3^2\\cdot5 = 180$.", { difficulty: "easy" });
  num("math.mid.u2.s2", "Find the coefficient of $x^3$ in the expansion of $(1 + x)^7$.", 35,
    "General term $\\binom{7}{r}x^r$; for $r = 3$: $\\binom{7}{3} = 35$.");
  num("math.mid.u2.s1", "Find the sum of the first 20 terms of the arithmetic progression $3, 7, 11, \\dots$", 820,
    "$a = 3$, $d = 4$, $S_{20} = \\frac{20}{2}\\,(2\\cdot3 + 19\\cdot4) = 10 \\cdot 82 = 820$.");
  mcq("math", "math.mid.u3.s2", "If $f(x) = x^2 \\sin x$, then $f'(x) =$", ["$2x\\cos x$", "$2x\\sin x + x^2\\cos x$", "$2x\\sin x - x^2\\cos x$", "$x^2\\cos x$"], 1,
    "Product rule: $(uv)' = u'v + uv'$ with $u = x^2$, $v = \\sin x$.");
  num("math.mid.u3.s3", "Evaluate $\\displaystyle\\int_0^2 (3x^2 + 1)\\,dx$.", 10, "Antiderivative $x^3 + x$; $[x^3 + x]_0^2 = 8 + 2 = 10$.");
  num("math.mid.u4.s1", "A fair coin is tossed 3 times. What is the probability of getting at least one head? (decimal)", 0.875,
    "Complement: $P(\\text{no heads}) = (1/2)^3 = 1/8$, so $P = 1 - 1/8 = 7/8 = 0.875$.");
  num("math.mid.u4.s2", "Find the median of $3, 9, 4, 7, 5, 8$.", 6, "Sorted: 3, 4, 5, 7, 8, 9. With an even count, median $= (5 + 7)/2 = 6$.", { difficulty: "easy" });
  num("math.mid.u5.s1", "Compute the dot product $(2, -1, 3) \\cdot (4, 0, -2)$.", 2, "$2\\cdot4 + (-1)\\cdot0 + 3\\cdot(-2) = 8 + 0 - 6 = 2$.", { difficulty: "easy" });
  num("math.mid.u5.s2", "Find $\\det\\begin{pmatrix}2 & 3\\\\ 1 & 4\\end{pmatrix}$.", 5, "$ad - bc = 2\\cdot4 - 3\\cdot1 = 5$.", { difficulty: "easy" });
  mcq("math", "math.mid.u6.s1", "Which expression is logically equivalent to $\\neg(p \\land q)$?", ["$\\neg p \\land \\neg q$", "$\\neg p \\lor \\neg q$", "$p \\lor q$", "$\\neg p \\to q$"], 1,
    "De Morgan's law: $\\neg(p \\land q) \\equiv \\neg p \\lor \\neg q$.", { difficulty: "easy" });
  mcq("math", "math.mid.u6.s2", "From the premises $p \\to q$ and $\\neg q$ we may conclude $\\neg p$. Which rule of inference is this?", ["Modus ponens", "Modus tollens", "Hypothetical syllogism", "Disjunctive syllogism"], 1,
    "Modus tollens: $(p\\to q) \\land \\neg q \\Rightarrow \\neg p$.");
  mcq("math", "math.mid.u7.s1", "Minimise $F(A,B) = \\sum m(1, 2, 3)$.", ["$AB$", "$A + B$", "$A \\oplus B$", "$\\overline{A} + B$"], 1,
    "Minterms 1, 2, 3 are every combination except $A = B = 0$, so $F = A + B$.");
  mcq("math", "math.mid.u7.s2", "In a half adder with inputs $A$ and $B$, the carry output is", ["$A \\oplus B$", "$A + B$", "$AB$", "$\\overline{AB}$"], 2,
    "Sum $= A \\oplus B$; carry is 1 only when both inputs are 1, i.e. $AB$.", { difficulty: "easy" });
  mcq("math", "math.ut2.u2.s3", "Which of these sets is **uncountable**?", ["$\\mathbb{Z}$", "$\\mathbb{Q}$", "$\\mathbb{N} \\times \\mathbb{N}$", "$\\mathbb{R}$"], 3,
    "$\\mathbb{Z}$, $\\mathbb{Q}$ and $\\mathbb{N}\\times\\mathbb{N}$ can be listed (put in bijection with $\\mathbb{N}$). Cantor's diagonal argument shows $\\mathbb{R}$ cannot.");
  mcq("math", "math.ut2.u2.s2", "On $\\{1, 2, 3\\}$, the relation $R = \\{(1,1), (2,2), (3,3), (1,2)\\}$ is", ["an equivalence relation", "reflexive, antisymmetric and transitive", "symmetric but not reflexive", "neither reflexive nor transitive"], 1,
    "All $(a,a)$ are present (reflexive); $(1,2)$ is present without $(2,1)$ (antisymmetric, not symmetric); every chain is closed (transitive). It is a partial order, not an equivalence relation.", { difficulty: "hard" });
  num("math.ut2.u4.s1", "In how many ways can 10 identical balls be placed into 4 distinct boxes (boxes may be empty)?", 286,
    "Stars and bars: $\\binom{10 + 4 - 1}{4 - 1} = \\binom{13}{3} = 286$.");
  num("math.ut2.u4.s1", "How many derangements of 4 objects are there (no object in its original position)?", 9,
    "$D_4 = 4!\\left(1 - 1 + \\frac{1}{2!} - \\frac{1}{3!} + \\frac{1}{4!}\\right) = 24 - 24 + 12 - 4 + 1 = 9$.", { difficulty: "hard" });
  add({ type: "msq", subject: "math", topicId: "math.ut2.u2.s1", marks: 2, prompt: "Let $A = \\{1, 2, 3\\}$ and $B = \\{2, 3, 4\\}$. Select **all** true statements.",
    options: ["$A \\cap B = \\{2, 3\\}$", "$|A \\cup B| = 4$", "$A - B = \\{1\\}$", "$|A \\times B| = 6$", "$A \\subseteq B$"], answer: [0, 1, 2],
    explanation: "$A\\cup B = \\{1,2,3,4\\}$ has 4 elements; $|A \\times B| = 3\\cdot3 = 9$, not 6; $1 \\in A$ but $1 \\notin B$, so $A \\not\\subseteq B$." });
  const subj = (topicId, prompt, rubric, modelSolution, extra = {}) => add(Object.assign({ type: "subjective", subject: "math", topicId, prompt, rubric, modelSolution,
    marks: rubric.reduce((s, r) => s + r.marks, 0) }, extra));
  subj("math.ut2.u3.s2", "Prove directly that the sum of two odd integers is even.",
    [{ criterion: "States the definition of odd integers correctly (m = 2a+1, n = 2b+1)", marks: 2 }, { criterion: "Correct algebraic working for m + n", marks: 2 }, { criterion: "Concludes with the form 2k, k an integer, and states the result", marks: 1 }],
    "Let $m$ and $n$ be odd. Then $m = 2a + 1$ and $n = 2b + 1$ for some integers $a, b$.\n\n$m + n = 2a + 2b + 2 = 2(a + b + 1)$.\n\nSince $k = a + b + 1$ is an integer, $m + n = 2k$ is even. $\\blacksquare$", { difficulty: "easy",
    hints: ["Start from the definition: what does it mean for an integer to be odd?", "Write both numbers in the form 2(something) + 1.", "Add them and factor out a 2."] });
  subj("math.ut2.u3.s4", "Prove by contradiction that $\\sqrt{2}$ is irrational.",
    [{ criterion: "Correct assumption: √2 = p/q with p, q integers, q ≠ 0, in lowest terms", marks: 2 }, { criterion: "Derives p² = 2q² and deduces p is even (with justification)", marks: 1 },
      { criterion: "Substitutes p = 2k and deduces q is even", marks: 1 }, { criterion: "Identifies the contradiction with lowest terms and concludes", marks: 2 }],
    "Suppose, for contradiction, $\\sqrt2 = p/q$ with integers $p, q$, $q \\ne 0$, and $\\gcd(p, q) = 1$.\n\nThen $p^2 = 2q^2$, so $p^2$ is even, hence $p$ is even (if $p$ were odd, $p^2$ would be odd). Write $p = 2k$.\n\nThen $4k^2 = 2q^2 \\Rightarrow q^2 = 2k^2$, so $q$ is even too.\n\nBoth $p$ and $q$ are even, contradicting $\\gcd(p, q) = 1$. Hence $\\sqrt2$ is irrational. $\\blacksquare$", { difficulty: "medium" });
  subj("math.ut2.u3.s5", "Prove by contrapositive: for an integer $n$, if $n^2$ is even then $n$ is even.",
    [{ criterion: "States the contrapositive correctly (if n is odd then n² is odd)", marks: 2 }, { criterion: "Correct working: n = 2k+1 ⇒ n² = 2(2k²+2k)+1", marks: 2 }, { criterion: "Concludes and links back to the original statement", marks: 1 }],
    "Contrapositive: if $n$ is odd then $n^2$ is odd.\n\nLet $n = 2k + 1$. Then $n^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1$, which is odd.\n\nThe contrapositive is true, so the original statement is true. $\\blacksquare$");
  subj("math.ut2.u3.s3", "Prove that $n^2 + n$ is even for every integer $n$, using proof by cases.",
    [{ criterion: "Identifies an exhaustive set of cases (n even / n odd)", marks: 1 }, { criterion: "Case n = 2k handled correctly", marks: 2 }, { criterion: "Case n = 2k + 1 handled correctly", marks: 2 }],
    "**Case 1:** $n = 2k$. Then $n^2 + n = 4k^2 + 2k = 2(2k^2 + k)$, even.\n\n**Case 2:** $n = 2k + 1$. Then $n^2 + n = (2k+1)(2k+2) = 2(2k+1)(k+1)$, even.\n\nThe cases are exhaustive, so $n^2 + n$ is always even. $\\blacksquare$");
  subj("math.mid.u3.s2", "For $f(x) = x^3 - 6x^2 + 9x + 1$, find $f'(x)$, all stationary points, and classify each as a local maximum or minimum. Show your working.",
    [{ criterion: "Correct derivative f'(x) = 3x² − 12x + 9", marks: 1 }, { criterion: "Solves f'(x) = 0 correctly: x = 1, x = 3", marks: 2 }, { criterion: "Uses a valid test (second derivative or sign change)", marks: 1 },
      { criterion: "Correct classification with function values: max (1, 5), min (3, 1)", marks: 2 }],
    "$f'(x) = 3x^2 - 12x + 9 = 3(x - 1)(x - 3)$, so stationary points at $x = 1$ and $x = 3$.\n\n$f''(x) = 6x - 12$. $f''(1) = -6 < 0$ → local maximum, $f(1) = 1 - 6 + 9 + 1 = 5$.\n\n$f''(3) = 6 > 0$ → local minimum, $f(3) = 27 - 54 + 27 + 1 = 1$.", { subkind: "derivation" });
  subj("math.ut2.u1.s2", "Minimise $F(A, B, C) = \\sum m(0, 1, 2, 3, 7)$ using a Karnaugh map. Show the groups you form.",
    [{ criterion: "Correct K-map with all five minterms placed", marks: 1 }, { criterion: "Forms the quad m(0,1,2,3) → A'", marks: 2 }, { criterion: "Forms the pair m(3,7) → BC", marks: 1 }, { criterion: "Final answer F = A' + BC", marks: 1 }],
    "Minterms 0–3 are exactly the cells with $A = 0$: one quad, giving $\\overline{A}$.\n\nMinterm 7 ($ABC$) pairs with minterm 3 ($\\overline{A}BC$): the pair gives $BC$.\n\n$F = \\overline{A} + BC$.");

  /* ---- Full Stack: MCQ ---- */
  mcq("fs", "fs.mid.u1.s1", "When you type a URL into the browser, what does DNS do?", ["Encrypts the connection", "Translates the domain name into an IP address", "Renders the HTML", "Caches CSS files"], 1,
    "DNS resolves a human-readable domain (example.com) to the IP address of the server; TLS handles encryption and the browser engine renders.", { difficulty: "easy" });
  mcq("fs", "fs.mid.u1.s5", "Which command creates a new branch called `feature` **and** switches to it?", ["git branch feature", "git switch -c feature", "git merge feature", "git push -b feature"], 1,
    "`git switch -c feature` (or the older `git checkout -b feature`) creates and checks out the branch. `git branch feature` only creates it.");
  mcq("fs", "fs.mid.u2.s2", "Which element best represents a self-contained piece of content such as a blog post?", ["<section>", "<div>", "<article>", "<aside>"], 2,
    "`<article>` is for independently distributable content. `<section>` groups related content under a heading; `<div>` has no semantics.", { difficulty: "easy" });
  mcq("fs", "fs.mid.u3.s3", "Which selector has the **highest** specificity?", ["ul li a", ".menu .item a", "#nav a", "a:hover"], 2,
    "Specificity (id, class, element): `#nav a` = (1,0,1); `.menu .item a` = (0,2,1); `a:hover` = (0,1,1); `ul li a` = (0,0,3). Any id beats any number of classes.");
  mcq("fs", "fs.mid.u3.s6", "An element has `width: 200px; padding: 10px; border: 5px solid;` and the default `box-sizing: content-box`. What is its rendered width?", ["200px", "215px", "230px", "220px"], 2,
    "content-box: width excludes padding and border. 200 + 2×10 + 2×5 = 230px.");
  mcq("fs", "fs.mid.u4.s2", "In a flex container with `flex-direction: row`, which property aligns items along the **cross** (vertical) axis?", ["justify-content", "align-items", "flex-wrap", "gap"], 1,
    "`justify-content` works on the main axis; `align-items` on the cross axis.", { difficulty: "easy" });
  mcq("fs", "fs.mid.u5.s2", "When does a rule inside `@media (min-width: 768px) { … }` apply?", ["Only when the viewport is narrower than 768px", "When the viewport is 768px wide or wider", "Only on printers", "Only at exactly 768px"], 1,
    "`min-width: 768px` matches viewports ≥ 768px — the mobile-first pattern.");
  mcq("fs", "fs.mid.u3.s7", "`1rem` is relative to", ["the parent element's font size", "the root (html) element's font size", "the viewport width", "the element's own font size"], 1,
    "`rem` = root em. `em` is relative to the element's (inherited) font size.");
  mcq("fs", "fs.ut2.u1.s2", "What does `console.log(typeof null)` print?", ["\"null\"", "\"object\"", "\"undefined\"", "\"number\""], 1,
    "A long-standing JavaScript quirk: `typeof null` is `\"object\"`.");
  mcq("fs", "fs.ut2.u1.s4", "What does `console.log(1 + \"2\" + 3)` print?", ["6", "\"15\"", "123", "33"], 2,
    "Left to right: `1 + \"2\"` is the string \"12\"; \"12\" + 3 is \"123\".");
  mcq("fs", "fs.ut2.u2.s5", "What does `console.log([1, 2, 3] === [1, 2, 3])` print?", ["true", "false", "TypeError", "undefined"], 1,
    "Arrays are objects; `===` compares references. Two separate array literals are different objects.");
  mcq("fs", "fs.ut2.u2.s6", "What is printed?\n```js\nconst a = { x: 1 };\nconst b = { ...a };\nb.x = 2;\nconsole.log(a.x);\n```", ["1", "2", "undefined", "TypeError"], 0,
    "Spread makes a (shallow) copy, so `b` is a new object; changing `b.x` does not affect `a`.");
  mcq("fs", "fs.ut2.u6.s2", "In what order are the letters logged?\n```js\nconsole.log(\"A\");\nsetTimeout(() => console.log(\"B\"), 0);\nPromise.resolve().then(() => console.log(\"C\"));\nconsole.log(\"D\");\n```", ["A B C D", "A D B C", "A D C B", "A C D B"], 2,
    "Synchronous code first (A, D). Then the microtask queue (promise callback C) runs before the macrotask queue (setTimeout B).", { difficulty: "hard",
    hints: ["Separate synchronous code from callbacks.", "Promises go to the microtask queue; setTimeout to the task queue.", "The microtask queue is emptied before the next task runs."] });
  mcq("fs", "fs.ut2.u2.s7", "What is the result of `[1, 2, 3, 4].filter(n => n % 2).map(n => n * 10)`?", ["[20, 40]", "[10, 30]", "[10, 20, 30, 40]", "[0, 20, 0, 40]"], 1,
    "`n % 2` is truthy (1) for odd numbers, so filter keeps [1, 3]; map gives [10, 30].");
  mcq("fs", "fs.ut2.u3.s2", "What is printed?\n```js\nlet x = 1;\n{\n  let x = 2;\n}\nconsole.log(x);\n```", ["1", "2", "undefined", "SyntaxError"], 0,
    "`let` is block-scoped; the inner `x` is a different variable that disappears after the block.");
  mcq("fs", "fs.ut2.u4.s4", "Which method returns a static NodeList of **all** elements that match a CSS selector?", ["document.getElementById", "document.querySelector", "document.querySelectorAll", "document.getElementsByClassName"], 2,
    "`querySelectorAll` returns a static NodeList of all matches; `querySelector` returns the first; `getElementsByClassName` returns a live HTMLCollection.", { difficulty: "easy" });
  mcq("fs", "fs.ut2.u2.s5", "What does `console.log(\"5\" == 5, \"5\" === 5)` print?", ["true true", "true false", "false false", "false true"], 1,
    "`==` coerces types before comparing; `===` requires the same type.");
  add({ type: "output", subject: "fs", topicId: "fs.ut2.u1.s7", difficulty: "easy",
    prompt: "Type the exact output:\n```js\nlet s = \"\";\nfor (let i = 0; i < 3; i++) {\n  s += i;\n}\nconsole.log(s);\n```", answer: "012",
    explanation: "Adding a number to a string concatenates: \"\" + 0 + 1 + 2 = \"012\"." });

  /* ---- Full Stack: JavaScript coding (function tests run in a sandboxed worker) ---- */
  const JT = (call, expected, category, hidden = false, mock) => ({ call, expected, category, hidden, mock });
  add({ type: "coding", lang: "js", subject: "fs", topicId: "fs.ut2.u2.s7", marks: 8, title: "Sum of even numbers", difficulty: "easy",
    prompt: "Write a function `sumEven(arr)` that returns the sum of the even numbers in an array.",
    inputFormat: "An array of integers.", outputFormat: "A number.", constraints: "The array may be empty.",
    steps: ["Filter the even numbers (n % 2 === 0).", "Reduce them to a sum with an initial value of 0."],
    sampleInput: "sumEven([1, 2, 3, 4])", sampleOutput: "6",
    starter: "function sumEven(arr) {\n  // your code here\n}\n",
    reference: "function sumEven(arr) {\n  return arr.filter(n => n % 2 === 0).reduce((s, n) => s + n, 0);\n}\n",
    tests: [JT("sumEven([1, 2, 3, 4])", "6", "basic"), JT("sumEven([])", "0", "edge"), JT("sumEven([-2, 3, 5])", "-2", "edge"), JT("sumEven([1, 3])", "0", "edge", true), JT("sumEven([10, 20, 30, 1])", "60", "normal", true)] });
  add({ type: "coding", lang: "js", subject: "fs", topicId: "fs.ut2.u2.s3", marks: 8, title: "Top students",
    prompt: "Write `topStudents(students, min)` that takes an array of `{ name, marks }` objects and returns an array of the **names** of students with `marks >= min`, sorted by marks from highest to lowest. Do not modify the original array.",
    inputFormat: "An array of objects and a number.", outputFormat: "An array of strings.", constraints: "Marks are distinct.",
    steps: ["filter by marks.", "Copy before sorting (sort mutates) — e.g. spread into a new array.", "sort with (a, b) => b.marks - a.marks.", "map to names."],
    sampleInput: "topStudents([{name:'A',marks:70},{name:'B',marks:90}], 60)", sampleOutput: "[\"B\",\"A\"]",
    starter: "function topStudents(students, min) {\n  // your code here\n}\n",
    reference: "function topStudents(students, min) {\n  return students.filter(s => s.marks >= min).sort((a, b) => b.marks - a.marks).map(s => s.name);\n}\n",
    tests: [JT("topStudents([{name:'A',marks:70},{name:'B',marks:90}], 60)", "[\"B\",\"A\"]", "basic"), JT("topStudents([], 50)", "[]", "edge"),
      JT("topStudents([{name:'A',marks:40}], 50)", "[]", "edge"), JT("topStudents([{name:'A',marks:50},{name:'B',marks:49},{name:'C',marks:99}], 50)", "[\"C\",\"A\"]", "boundary", true),
      JT("(() => { const s = [{name:'X',marks:1},{name:'Y',marks:2}]; topStudents(s, 0); return s.map(o => o.name); })()", "[\"X\",\"Y\"]", "edge", true)] });
  add({ type: "coding", lang: "js", subject: "fs", topicId: "fs.ut2.u3.s2", marks: 8, title: "Counter with closures",
    prompt: "Write `makeCounter()` that returns a function. Each call of the returned function increments a private count and returns the new value. Separate counters must be independent.",
    inputFormat: "—", outputFormat: "Numbers returned from calls.", constraints: "Do not use global variables for the count.",
    steps: ["Declare a variable inside makeCounter.", "Return an inner function that increments and returns it.", "The inner function closes over the variable."],
    sampleInput: "const c = makeCounter(); c(); c()", sampleOutput: "2",
    starter: "function makeCounter() {\n  // your code here\n}\n",
    reference: "function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\n",
    tests: [JT("(() => { const c = makeCounter(); c(); c(); return c(); })()", "3", "basic"), JT("(() => { const c = makeCounter(); return c(); })()", "1", "boundary"),
      JT("(() => { const a = makeCounter(); const b = makeCounter(); a(); a(); return b(); })()", "1", "edge", true)] });
  add({ type: "coding", lang: "js", subject: "fs", topicId: "fs.ut2.u6.s6", marks: 10, title: "Fetch user names (async/await)", difficulty: "hard",
    prompt: "Write an `async` function `getUserNames()` that fetches `https://api.example.com/users` and resolves to an array of the users' `name` values. If the response is not OK (`response.ok` is false) or the request throws, resolve to an empty array `[]`.\n\nIn this lab `fetch` is a **mock** that returns preset data — no real network is used.",
    inputFormat: "The API returns JSON: an array of { id, name }.", outputFormat: "A Promise resolving to string[]", constraints: "Use async/await and try/catch.",
    steps: ["await fetch(url).", "Check response.ok.", "await response.json().", "map to names.", "Wrap everything in try/catch and return [] on failure."],
    sampleInput: "await getUserNames()", sampleOutput: "[\"Asha\",\"Ravi\"]",
    starter: "async function getUserNames() {\n  // your code here\n}\n",
    reference: "async function getUserNames() {\n  try {\n    const res = await fetch('https://api.example.com/users');\n    if (!res.ok) return [];\n    const data = await res.json();\n    return data.map(u => u.name);\n  } catch (e) {\n    return [];\n  }\n}\n",
    tests: [JT("getUserNames()", "[\"Asha\",\"Ravi\"]", "basic", false, { "https://api.example.com/users": { status: 200, body: [{ id: 1, name: "Asha" }, { id: 2, name: "Ravi" }] } }),
      JT("getUserNames()", "[]", "edge", false, { "https://api.example.com/users": { status: 500, body: { error: "server" } } }),
      JT("getUserNames()", "[]", "edge", true, { "https://api.example.com/users": { status: 200, body: [] } }),
      JT("getUserNames()", "[]", "edge", true, { "https://api.example.com/users": { throws: "Network down" } })] });

  /* ---- Full Stack: web labs (checks run against the live preview) ---- */
  add({ type: "web", lab: "html", subject: "fs", topicId: "fs.mid.u2.s2", marks: 20, title: "Issue #12 — Semantic profile page", difficulty: "medium",
    prompt: "**Issue #12: Build the profile page**\n\nImplement `index.html` so that it:\n1. Has a `<!DOCTYPE html>`, `<html lang=\"en\">`, a `<title>` and a viewport `<meta>`.\n2. Has a `<header>` containing exactly one `<h1>` and a `<nav>` with links to `#about`, `#projects` and `#contact`.\n3. Has a `<main>` with three `<section>` elements whose ids are `about`, `projects`, `contact`, each starting with an `<h2>`.\n4. `#about` contains an `<img>` with a non-empty `alt`.\n5. `#projects` contains a `<ul>` with at least 3 `<li>`.\n6. `#contact` contains a `<form>` with: a text input `name` (required), an email input `email` (required), a `<textarea name=\"message\">`, each with an associated `<label>`, and a submit button.\n7. Ends with a `<footer>`.",
    files: { html: "<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n  <!-- build the page here -->\n</body>\n</html>\n", css: "", js: "" }, editable: ["html"],
    reference: { html: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<title>Profile</title>\n</head>\n<body>\n<header><h1>Asha</h1><nav><a href=\"#about\">About</a> <a href=\"#projects\">Projects</a> <a href=\"#contact\">Contact</a></nav></header>\n<main>\n<section id=\"about\"><h2>About</h2><img src=\"data:image/gif;base64,R0lGODlhAQABAAAAACw=\" alt=\"Portrait of Asha\"><p>Student.</p></section>\n<section id=\"projects\"><h2>Projects</h2><ul><li>One</li><li>Two</li><li>Three</li></ul></section>\n<section id=\"contact\"><h2>Contact</h2><form><label for=\"n\">Name</label><input id=\"n\" type=\"text\" name=\"name\" required><label for=\"e\">Email</label><input id=\"e\" type=\"email\" name=\"email\" required><label for=\"m\">Message</label><textarea id=\"m\" name=\"message\"></textarea><button type=\"submit\">Send</button></form></section>\n</main>\n<footer>© 2026</footer>\n</body>\n</html>\n", css: "", js: "" },
    checks: [
      { desc: "Doctype, html lang, title and viewport meta", marks: 2, code: "return /^\\s*<!doctype html>/i.test(h.src.html) && !!doc.documentElement.getAttribute('lang') && !!doc.title.trim() && !!h.$('meta[name=viewport]');" },
      { desc: "header contains exactly one h1 (and the page has only one h1)", marks: 2, code: "return h.$$('h1').length === 1 && !!h.$('header h1');" },
      { desc: "nav links to #about, #projects, #contact", marks: 3, code: "const hrefs = h.$$('header nav a').map(a => a.getAttribute('href')); return ['#about','#projects','#contact'].every(x => hrefs.includes(x)) || 'nav links found: ' + hrefs.join(', ');" },
      { desc: "main has sections #about, #projects, #contact each beginning with h2", marks: 3, code: "return ['about','projects','contact'].every(id => { const s = h.$('main section#' + id); return s && s.firstElementChild && s.firstElementChild.tagName === 'H2'; });" },
      { desc: "#about has an img with non-empty alt", marks: 2, code: "const i = h.$('#about img'); return !!i && !!(i.getAttribute('alt') || '').trim();" },
      { desc: "#projects has a ul with ≥ 3 li", marks: 2, code: "return h.$$('#projects ul > li').length >= 3;" },
      { desc: "Form fields have correct types, names and required attributes", marks: 3, code: "const f = h.$('#contact form'); if (!f) return 'no form in #contact'; const n = f.querySelector('input[name=name]'), e = f.querySelector('input[name=email]'), m = f.querySelector('textarea[name=message]'); return !!(n && (n.type === 'text') && n.required && e && e.type === 'email' && e.required && m && f.querySelector('button[type=submit], input[type=submit], button:not([type])'));" },
      { desc: "Every form control has an associated label", marks: 2, code: "const ctrls = h.$$('#contact form input:not([type=submit]), #contact form textarea'); if (!ctrls.length) return false; return ctrls.every(c => (c.labels && c.labels.length > 0)) || 'some controls have no <label>';" },
      { desc: "Page ends with a footer", marks: 1, code: "return !!h.$('body > footer');" },
    ] });
  const cssLabHtml = "<!DOCTYPE html>\n<html lang=\"en\">\n<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Courses</title></head>\n<body>\n  <header class=\"site-header\">\n    <span class=\"logo\">ExamForge</span>\n    <nav><a href=\"#\">Home</a> <a href=\"#\">Courses</a> <a href=\"#\">Contact</a></nav>\n  </header>\n  <main>\n    <h1 class=\"title\">Courses</h1>\n    <div class=\"cards\">\n      <article class=\"card\">Python</article>\n      <article class=\"card\">Maths</article>\n      <article class=\"card\">Full Stack</article>\n    </div>\n  </main>\n</body>\n</html>\n";
  add({ type: "web", lab: "css", subject: "fs", topicId: "fs.mid.u5.s2", marks: 20, title: "Responsive course cards",
    prompt: "The HTML is given. Write **CSS only** so that:\n1. Every element uses `box-sizing: border-box`.\n2. `.site-header` is a flex container with `justify-content: space-between` and items vertically centred.\n3. Links inside `nav` have no underline.\n4. `.title` uses a font size set in `rem` equal to 2rem (32px with the default root size).\n5. `.cards` is a CSS grid with a gap of 16px: **1 column** below 600px, **3 equal columns** at 1024px and above.\n6. Each `.card` has 16px padding and a border radius of at least 8px.",
    files: { html: cssLabHtml, css: "/* write your CSS here */\n", js: "" }, editable: ["css"],
    reference: { html: cssLabHtml, css: "*, *::before, *::after { box-sizing: border-box; }\n.site-header { display: flex; justify-content: space-between; align-items: center; }\nnav a { text-decoration: none; }\n.title { font-size: 2rem; }\n.cards { display: grid; gap: 16px; grid-template-columns: 1fr; }\n@media (min-width: 600px) { .cards { grid-template-columns: repeat(2, 1fr); } }\n@media (min-width: 1024px) { .cards { grid-template-columns: repeat(3, 1fr); } }\n.card { padding: 16px; border-radius: 8px; border: 1px solid #ccc; }\n", js: "" },
    checks: [
      { desc: "box-sizing: border-box on all elements", marks: 2, code: "return ['.card','.cards','header','main','h1'].every(s => h.css(s, 'box-sizing') === 'border-box');" },
      { desc: ".site-header is flex, space-between, align-items center", marks: 4, code: "return h.css('.site-header','display') === 'flex' && h.css('.site-header','justify-content') === 'space-between' && h.css('.site-header','align-items') === 'center';" },
      { desc: "nav links have no underline", marks: 2, code: "return h.$$('nav a').every(a => !win.getComputedStyle(a).textDecorationLine.includes('underline'));" },
      { desc: ".title is 2rem (32px) and written in rem", marks: 2, code: "return h.css('.title','font-size') === '32px' && /\\.title[^{]*\\{[^}]*font-size\\s*:\\s*2rem/.test(h.src.css);" },
      { desc: ".cards is a grid with 16px gap", marks: 2, code: "return h.css('.cards','display') === 'grid' && h.css('.cards','row-gap') === '16px' && h.css('.cards','column-gap') === '16px';" },
      { desc: "1 column at 375px", marks: 3, viewport: 375, code: "return h.columns('.cards') === 1 || 'columns: ' + h.columns('.cards');" },
      { desc: "3 equal columns at 1280px", marks: 3, viewport: 1280, code: "const c = h.css('.cards','grid-template-columns').split(' ').filter(Boolean).map(parseFloat); return (c.length === 3 && Math.max(...c) - Math.min(...c) < 2) || 'grid-template-columns: ' + h.css('.cards','grid-template-columns');" },
      { desc: ".card has 16px padding and radius ≥ 8px", marks: 2, code: "return h.css('.card','padding-top') === '16px' && h.css('.card','padding-left') === '16px' && parseFloat(h.css('.card','border-top-left-radius')) >= 8;" },
    ] });
  const todoHtml = "<!DOCTYPE html>\n<html lang=\"en\">\n<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Todo</title></head>\n<body>\n  <h1>Todo</h1>\n  <form id=\"todo-form\">\n    <label for=\"todo-input\">Task</label>\n    <input id=\"todo-input\" type=\"text\">\n    <button type=\"submit\">Add</button>\n  </form>\n  <p>Remaining: <span id=\"count\">0</span></p>\n  <ul id=\"todo-list\"></ul>\n</body>\n</html>\n";
  add({ type: "web", lab: "js", subject: "fs", topicId: "fs.ut2.u5.s2", marks: 15, title: "Todo list (DOM + events)",
    prompt: "HTML is given. Write **JavaScript** so that:\n1. Submitting `#todo-form` does **not** reload the page.\n2. The trimmed text of `#todo-input` is added as a new `<li>` in `#todo-list`; empty/whitespace input is ignored.\n3. The input is cleared after adding.\n4. `#count` shows the number of items **not** marked done.\n5. Clicking an `<li>` toggles the class `done` on it and updates `#count`.",
    files: { html: todoHtml, css: ".done { text-decoration: line-through; opacity: .6; }\n", js: "// write your JavaScript here\n" }, editable: ["js", "css"],
    reference: { html: todoHtml, css: ".done { text-decoration: line-through; }\n", js: "const form = document.querySelector('#todo-form');\nconst input = document.querySelector('#todo-input');\nconst list = document.querySelector('#todo-list');\nconst count = document.querySelector('#count');\nfunction update() { count.textContent = list.querySelectorAll('li:not(.done)').length; }\nform.addEventListener('submit', e => {\n  e.preventDefault();\n  const t = input.value.trim();\n  if (!t) return;\n  const li = document.createElement('li');\n  li.textContent = t;\n  li.addEventListener('click', () => { li.classList.toggle('done'); update(); });\n  list.appendChild(li);\n  input.value = '';\n  update();\n});\n" },
    checks: [
      { desc: "Submitting adds an li with the trimmed text", marks: 4, code: "h.type('#todo-input', '  Revise loops  '); h.submit('#todo-form'); await h.wait(50); const li = h.$$('#todo-list li'); return (li.length === 1 && li[0].textContent.trim() === 'Revise loops') || 'li count ' + li.length;" },
      { desc: "Form submission is prevented (no reload)", marks: 2, code: "h.type('#todo-input', 'x'); const ev = h.submit('#todo-form'); return ev.defaultPrevented || 'preventDefault() was not called';" },
      { desc: "Empty / whitespace input is ignored", marks: 2, code: "h.type('#todo-input', '   '); h.submit('#todo-form'); await h.wait(50); return h.$$('#todo-list li').length === 0;" },
      { desc: "Input cleared after adding", marks: 1, code: "h.type('#todo-input', 'a'); h.submit('#todo-form'); await h.wait(50); return h.$('#todo-input').value === '';" },
      { desc: "#count shows remaining items", marks: 3, code: "for (const t of ['a','b','c']) { h.type('#todo-input', t); h.submit('#todo-form'); } await h.wait(50); return h.text('#count') === '3' || '#count is ' + h.text('#count');" },
      { desc: "Clicking an li toggles .done and updates count", marks: 3, code: "for (const t of ['a','b']) { h.type('#todo-input', t); h.submit('#todo-form'); } await h.wait(50); const li = h.$('#todo-list li'); li.click(); await h.wait(30); const ok1 = li.classList.contains('done') && h.text('#count') === '1'; li.click(); await h.wait(30); return (ok1 && !li.classList.contains('done') && h.text('#count') === '2') || 'toggle/count incorrect';" },
    ] });
  const dashHtml = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <title>Student Dashboard</title>\n</head>\n<body>\n  <!-- Build: header, main (form#student-form + #error + #avg + #cards), footer -->\n</body>\n</html>\n";
  add({ type: "web", lab: "integrated", subject: "fs", topicId: "fs.ut2.u6.s7", marks: 30, title: "Practical: Student Dashboard", difficulty: "hard",
    prompt: "**Build a Student Dashboard** (HTML + CSS + JS).\n\nRequirements:\n1. Semantic structure: `<header>` (with an `<h1>`), `<main>`, `<footer>`.\n2. A form `#student-form` with a text input `name` (required) and a number input `marks` (min 0, max 100), each labelled, and a submit button.\n3. On load, fetch `https://api.example.com/students` (mock, returns `[{name, marks}]`) and render one `.student-card` per student inside `#cards`. Each card shows the name and the marks.\n4. Submitting the form (no reload) with a non-empty name and marks 0–100 adds a new `.student-card`. Otherwise show a message in `#error` and add nothing; clear `#error` after a valid submission.\n5. `#avg` shows the average marks of all cards to **one decimal place** (e.g. `76.5`).\n6. `#cards` is a grid: **1 column at 375px**, **at least 2 columns at 1024px**.",
    files: { html: dashHtml, css: "/* styles */\n", js: "// script\n" }, editable: ["html", "css", "js"],
    mock: { "https://api.example.com/students": { status: 200, body: [{ name: "Asha", marks: 82 }, { name: "Ravi", marks: 71 }] } },
    reference: { html: "<!DOCTYPE html>\n<html lang=\"en\">\n<head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Student Dashboard</title></head>\n<body>\n<header><h1>Student Dashboard</h1></header>\n<main>\n<form id=\"student-form\"><label for=\"nm\">Name</label><input id=\"nm\" name=\"name\" type=\"text\" required><label for=\"mk\">Marks</label><input id=\"mk\" name=\"marks\" type=\"number\" min=\"0\" max=\"100\"><button type=\"submit\">Add</button></form>\n<p id=\"error\" role=\"alert\"></p>\n<p>Average: <span id=\"avg\">0.0</span></p>\n<section id=\"cards\"></section>\n</main>\n<footer>ExamForge</footer>\n</body>\n</html>\n",
      css: "#cards { display: grid; gap: 12px; grid-template-columns: 1fr; }\n@media (min-width: 768px) { #cards { grid-template-columns: repeat(3, 1fr); } }\n.student-card { padding: 12px; border: 1px solid #ccc; border-radius: 8px; }\n",
      js: "const cards = document.querySelector('#cards');\nconst err = document.querySelector('#error');\nconst avg = document.querySelector('#avg');\nconst data = [];\nfunction render() {\n  cards.innerHTML = '';\n  data.forEach(s => { const d = document.createElement('article'); d.className = 'student-card'; d.textContent = s.name + ' — ' + s.marks; cards.appendChild(d); });\n  avg.textContent = data.length ? (data.reduce((a, s) => a + s.marks, 0) / data.length).toFixed(1) : '0.0';\n}\nasync function load() {\n  try { const r = await fetch('https://api.example.com/students'); if (r.ok) { (await r.json()).forEach(s => data.push(s)); } } catch (e) {}\n  render();\n}\ndocument.querySelector('#student-form').addEventListener('submit', e => {\n  e.preventDefault();\n  const f = e.target; const name = f.name.value.trim(); const m = Number(f.marks.value);\n  if (!name || f.marks.value === '' || isNaN(m) || m < 0 || m > 100) { err.textContent = 'Enter a name and marks between 0 and 100'; return; }\n  err.textContent = ''; data.push({ name, marks: m }); render(); f.reset();\n});\nload();\n" },
    checks: [
      { desc: "Semantic header (with h1), main, footer", marks: 3, code: "return !!(h.$('header h1') && h.$('main') && h.$('footer'));" },
      { desc: "Form has labelled name (required) and number marks (0–100) inputs", marks: 4, code: "const f = h.$('#student-form'); if (!f) return 'no #student-form'; const n = f.querySelector('input[name=name]'), m = f.querySelector('input[name=marks]'); return !!(n && n.required && m && m.type === 'number' && m.min === '0' && m.max === '100' && n.labels && n.labels.length && m.labels && m.labels.length);" },
      { desc: "Initial API data rendered as .student-card elements", marks: 5, code: "await h.wait(300); const c = h.$$('#cards .student-card'); return (c.length === 2 && /Asha/.test(c[0].textContent) && /82/.test(c[0].textContent)) || 'cards: ' + c.length;" },
      { desc: "#avg shows the average to one decimal place", marks: 4, code: "await h.wait(300); return h.text('#avg') === '76.5' || '#avg is \"' + h.text('#avg') + '\"';" },
      { desc: "Valid submission adds a card, updates average, prevents reload", marks: 5, code: "await h.wait(300); h.type('#student-form input[name=name]', 'Meera'); h.type('#student-form input[name=marks]', '100'); const ev = h.submit('#student-form'); await h.wait(50); return (ev.defaultPrevented && h.$$('#cards .student-card').length === 3 && h.text('#avg') === '84.3') || 'cards ' + h.$$('#cards .student-card').length + ', avg ' + h.text('#avg');" },
      { desc: "Invalid marks show #error and add nothing", marks: 4, code: "await h.wait(300); h.type('#student-form input[name=name]', 'Zed'); h.type('#student-form input[name=marks]', '150'); h.submit('#student-form'); await h.wait(50); return (h.$$('#cards .student-card').length === 2 && h.text('#error').length > 0) || 'error/card count wrong';" },
      { desc: "1 column at 375px", marks: 2, viewport: 375, code: "await h.wait(300); return h.columns('#cards') === 1 || 'columns: ' + h.columns('#cards');" },
      { desc: "≥ 2 columns at 1024px", marks: 3, viewport: 1024, code: "await h.wait(300); return h.columns('#cards') >= 2 || 'columns: ' + h.columns('#cards');" },
    ] });

  /* ---------------- Flashcards (seed) ---------------- */
  const C = (subject, topicId, front, back) => ({ subject, topicId, front, back });
  const CARDS = [
    C("math", "math.mid.u2.s2", "Binomial theorem: general term of $(a+b)^n$", "$T_{r+1} = \\binom{n}{r} a^{n-r} b^r$"),
    C("math", "math.mid.u2.s1", "Sum of the first n terms of an AP", "$S_n = \\frac{n}{2}\\,(2a + (n-1)d)$"),
    C("math", "math.mid.u2.s1", "Sum of the first n terms of a GP ($r \\ne 1$)", "$S_n = a\\,\\frac{r^n - 1}{r - 1}$"),
    C("math", "math.mid.u3.s2", "Product rule and quotient rule", "$(uv)' = u'v + uv'$, $\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}$"),
    C("math", "math.mid.u4.s1", "$P(A \\cup B)$", "$P(A) + P(B) - P(A \\cap B)$"),
    C("math", "math.mid.u6.s1", "De Morgan's laws", "$\\neg(p\\land q) \\equiv \\neg p \\lor \\neg q$, $\\neg(p \\lor q) \\equiv \\neg p \\land \\neg q$"),
    C("math", "math.ut2.u3.s5", "Contrapositive of $p \\to q$", "$\\neg q \\to \\neg p$ (logically equivalent to $p \\to q$)"),
    C("math", "math.ut2.u4.s1", "Stars and bars: n identical items into k distinct boxes", "$\\binom{n + k - 1}{k - 1}$"),
    C("math", "math.ut2.u2.s2", "An equivalence relation is…", "Reflexive, symmetric and transitive."),
    C("python", "python.mid.u2.s3", "`//` vs `/` vs `%` in Python", "`/` true division (float); `//` floor division; `%` remainder with the sign of the divisor."),
    C("python", "python.mid.u3.s4", "Why is `0.1 + 0.2 != 0.3`?", "Binary floating point cannot represent 0.1 exactly. Use `math.isclose(a, b)`."),
    C("python", "python.mid.u4.s1", "Mutable vs immutable built-ins", "Mutable: list, dict, set. Immutable: int, float, str, tuple, frozenset."),
    C("python", "python.ut2.u4.s2", "`s[a:b:c]` slicing", "Start a (inclusive), stop b (exclusive), step c; `s[::-1]` reverses."),
    C("python", "python.ut2.u2.s1", "Euclid's algorithm", "`while b: a, b = b, a % b` → a is the GCD; `lcm = x * y // gcd`."),
    C("fs", "fs.mid.u3.s3", "Specificity order", "inline > id > class / attribute / pseudo-class > element / pseudo-element. Compare as (ids, classes, elements)."),
    C("fs", "fs.mid.u3.s6", "`box-sizing: border-box`", "width/height include padding and border (content shrinks)."),
    C("fs", "fs.mid.u4.s2", "justify-content vs align-items", "justify-content → main axis; align-items → cross axis."),
    C("fs", "fs.ut2.u2.s7", "map / filter / reduce", "map transforms each item; filter keeps items passing a test; reduce folds to one value (give an initial value)."),
    C("fs", "fs.ut2.u6.s2", "Microtasks vs macrotasks", "After synchronous code, all microtasks (promise callbacks) run before the next macrotask (setTimeout, events)."),
    C("fs", "fs.ut2.u5.s2", "Stop a form from reloading the page", "`form.addEventListener('submit', e => { e.preventDefault(); … })`"),
  ];

  window.EF_DEFAULTS = function () {
    return JSON.parse(JSON.stringify({
      version: 1,
      settings: { studentName: "", dailyTarget: 20, masteryMinAttempts: 6, masteryAccuracy: 0.8, masteryWindow: 10, masteryMinDays: 2,
        codeTimeoutSec: 5, outputCompare: "trim", msqPartial: false, defaultNegative: 0, retestDays: 2, aiEnabled: true },
      cycles: [{ id: "mid", name: "Mid-Semester" }, { id: "ut2", name: "Unit Test 2" }],
      subjects: [{ id: "math", name: "Mathematics" }, { id: "python", name: "Python" }, { id: "fs", name: "Full Stack" }],
      exams: EXAMS, syllabus: buildSyllabus(), questions: Q, seedCards: CARDS,
    }));
  };
})();
