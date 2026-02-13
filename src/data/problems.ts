
export interface TestCase {
    input: string;
    output: string;
    explanation?: string;
}

export interface MCQQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    category: 'data-structure' | 'algorithm' | 'approach';
}

export interface Problem {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    inputFormat: string;
    outputFormat: string;
    constraints: string[];
    testCases: TestCase[];
    tags: string[];
    hints: string[];
    optimalSolution: string;
    timeComplexity?: string;
    spaceComplexity?: string;
    template: string;
    templates?: { [key: string]: string };
    methodName: string;
    mcqs: MCQQuestion[];
}

export const problems: Problem[] = [
    {
        id: '1',
        title: 'Two Sum',
        difficulty: 'Easy',
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.`,
        inputFormat: 'nums = [2,7,11,15], target = 9',
        outputFormat: '[0,1]',
        constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', '-10⁹ ≤ target ≤ 10⁹', 'Only one valid answer exists.'],
        testCases: [
            { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
            { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
            { input: 'nums = [3,3], target = 6', output: '[0,1]' }
        ],
        tags: ['Array', 'Hash Table'],
        hints: ['Try using a hash table to store the complement of each number.', 'The complement of a number x is target - x.'],
        optimalSolution: "def twoSum(nums, target):\n    num_map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in num_map:\n            return [num_map[complement], i]\n        num_map[num] = i\n    return []",
        methodName: 'twoSum',
        template: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '1-1', question: 'What is the most suitable data structure for solving the Two Sum problem efficiently?', options: ['Array', 'Linked List', 'Hash Table', 'Stack'], correctAnswer: 2, explanation: 'Hash Table provides O(1) average time complexity for lookups.', category: 'data-structure' },
            { id: '1-2', question: 'What is the time complexity of the optimal solution?', options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'], correctAnswer: 2, explanation: 'Using a hash table, we can solve this in O(n) time.', category: 'algorithm' }
        ]
    },
    {
        id: '2',
        title: 'Palindrome Number',
        difficulty: 'Easy',
        description: `Given an integer x, return true if x is a palindrome, and false otherwise.`,
        inputFormat: 'x = 121',
        outputFormat: 'true',
        constraints: ['-2³¹ ≤ x ≤ 2³¹ - 1'],
        testCases: [
            { input: 'x = 121', output: 'true' },
            { input: 'x = -121', output: 'false' },
            { input: 'x = 10', output: 'false' }
        ],
        tags: ['Math'],
        hints: ['Beware of negative numbers.', 'Could you solve it without converting the integer to a string?'],
        optimalSolution: "def isPalindrome(x):\n    if x < 0: return False\n    return str(x) == str(x)[::-1]",
        methodName: 'isPalindrome',
        template: "class Solution:\n    def isPalindrome(self, x: int) -> bool:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '2-1', question: 'Why is str(x) == str(x)[::-1] commonly used in Python?', options: ['It is fastest', 'It leverages slicing for brevity', 'O(1) space', 'Only works for integers'], correctAnswer: 1, explanation: 'Python slicing [::-1] is a concise way to reverse a string.', category: 'approach' },
            { id: '2-2', question: 'How can you solve this without string conversion?', options: ['Recursion', 'Reversing half the integer', 'Bitwise operations', 'Using a stack'], correctAnswer: 1, explanation: 'Reversing the second half of the number avoids string conversion.', category: 'algorithm' }
        ]
    },
    {
        id: '3',
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.`,
        inputFormat: 's = "()"',
        outputFormat: 'true',
        constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only'],
        testCases: [
            { input: 's = "()"', output: 'true' },
            { input: 's = "()[]{}"', output: 'true' },
            { input: 's = "(]"', output: 'false' }
        ],
        tags: ['String', 'Stack'],
        hints: ['Use a stack of characters.', 'Match top of stack for closing brackets.'],
        optimalSolution: "def isValid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top: return False\n        else: stack.append(char)\n    return not stack",
        methodName: 'isValid',
        template: "class Solution:\n    def isValid(self, s: str) -> bool:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '3-1', question: 'Which data structure is best for matching parentheses?', options: ['Queue', 'Stack', 'Heap', 'Graph'], correctAnswer: 1, explanation: 'A stack is LIFO, which matches nested parentheses.', category: 'data-structure' },
            { id: '3-2', question: 'What to check for closing brackets?', options: ['Stack empty', 'Matches top', 'Both A and B', 'More characters'], correctAnswer: 2, explanation: 'Must check for matching top and handle empty stack.', category: 'approach' }
        ]
    },
    {
        id: '4',
        title: 'Merge Two Sorted Lists',
        difficulty: 'Easy',
        description: `Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.`,
        inputFormat: 'l1 = [1,2,4], l2 = [1,3,4]',
        outputFormat: '[1,1,2,3,4,4]',
        constraints: ['The number of nodes in both lists is in the range [0, 50].', '-100 ≤ Node.val ≤ 100', 'Both l1 and l2 are sorted in non-decreasing order.'],
        testCases: [
            { input: 'l1 = [1,2,4], l2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
            { input: 'l1 = [], l2 = []', output: '[]' },
            { input: 'l1 = [], l2 = [0]', output: '[0]' }
        ],
        tags: ['Linked List', 'Recursion'],
        hints: ['Use a dummy head node to simplify the logic.', 'Compare the values of the two lists and append the smaller one.'],
        optimalSolution: "def mergeTwoLists(l1, l2):\n    dummy = ListNode(0)\n    curr = dummy\n    while l1 and l2:\n        if l1.val < l2.val:\n            curr.next = l1\n            l1 = l1.next\n        else:\n            curr.next = l2\n            l2 = l2.next\n        curr = curr.next\n    curr.next = l1 or l2\n    return dummy.next",
        methodName: 'mergeTwoLists',
        template: "class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '4-1', question: 'What is the benefit of using a dummy node?', options: ['Faster execution', 'Less memory', 'Simpler edge case handling', 'Required for linked lists'], correctAnswer: 2, explanation: 'A dummy node avoids special checks for the head of the list.', category: 'approach' },
            { id: '4-2', question: 'What is the time complexity of merging two lists of length n and m?', options: ['O(min(n,m))', 'O(max(n,m))', 'O(n+m)', 'O(n*m)'], correctAnswer: 2, explanation: 'We process each node once, resulting in O(n+m).', category: 'algorithm' }
        ]
    },
    {
        id: '5',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
        inputFormat: 'prices = [7,1,5,3,6,4]',
        outputFormat: '5',
        constraints: ['1 ≤ prices.length ≤ 10⁵', '0 ≤ prices[i] ≤ 10⁴'],
        testCases: [
            { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' },
            { input: 'prices = [7,6,4,3,1]', output: '0' }
        ],
        tags: ['Array', 'Dynamic Programming'],
        hints: ['Keep track of the minimum price seen so far.', 'The max profit is the max difference between current price and min price.'],
        optimalSolution: "def maxProfit(prices):\n    min_price = float('inf')\n    max_profit = 0\n    for price in prices:\n        if price < min_price:\n            min_price = price\n        elif price - min_price > max_profit:\n            max_profit = price - min_price\n    return max_profit",
        methodName: 'maxProfit',
        template: "class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '5-1', question: 'Can we use two nested loops to solve this?', options: ['Yes, O(n)', 'Yes, O(n²)', 'No', 'Yes, O(log n)'], correctAnswer: 1, explanation: 'Brute force uses two loops but is less efficient than the O(n) one-pass solution.', category: 'algorithm' },
            { id: '5-2', question: 'What does min_price represent in the optimal solution?', options: ['Total cost', 'Cheapest day to buy so far', 'Current price', 'Max loss'], correctAnswer: 1, explanation: 'Tracing the lowest point seen allows calculation of potential profit at any day.', category: 'approach' }
        ]
    },
    {
        id: '6',
        title: 'Reverse String',
        difficulty: 'Easy',
        description: `Write a function that reverses a string. The input string is given as an array of characters s.`,
        inputFormat: 's = ["h","e","l","l","o"]',
        outputFormat: '["o","l","l","e","h"]',
        constraints: ['1 ≤ s.length ≤ 10⁵', 's[i] is a printable ascii character.'],
        testCases: [
            { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
            { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }
        ],
        tags: ['Two Pointers', 'String'],
        hints: ['Use two pointers, one at the start and one at the end.', 'Swap the elements at the pointers and move them towards each other.'],
        optimalSolution: "def reverseString(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1",
        methodName: 'reverseString',
        template: "class Solution:\n    def reverseString(self, s: List[str]) -> None:\n        # Do not return anything, modify s in-place instead.\n        pass",
        mcqs: [
            { id: '6-1', question: 'What is the space complexity of the two-pointer approach?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correctAnswer: 2, explanation: 'Two-pointer swap in-place uses constant extra space.', category: 'algorithm' },
            { id: '6-2', question: 'Why use a while loop for this?', options: ['Required for strings', 'To iterate until pointers meet', 'Faster than for loops', 'Handles empty strings better'], correctAnswer: 1, explanation: 'The condition left < right naturally terminates the swapping process.', category: 'approach' }
        ]
    },
    {
        id: '7',
        title: 'Maximum Subarray',
        difficulty: 'Medium',
        description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.`,
        inputFormat: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        outputFormat: '6',
        constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'],
        testCases: [
            { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has the largest sum = 6.' },
            { input: 'nums = [1]', output: '1' },
            { input: 'nums = [5,4,-1,7,8]', output: '23' }
        ],
        tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
        hints: ["Try Kadane's algorithm.", 'If current sum becomes negative, reset it to 0.'],
        optimalSolution: "def maxSubArray(nums):\n    cur_sum = max_sum = nums[0]\n    for x in nums[1:]:\n        cur_sum = max(x, cur_sum + x)\n        max_sum = max(max_sum, cur_sum)\n    return max_sum",
        methodName: 'maxSubArray',
        template: "class Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '7-1', question: "What is the core idea of Kadane's algorithm?", options: ['Sorting', 'Keeping track of local vs global maximum', 'Binary search', 'Recursion'], correctAnswer: 1, explanation: 'It maintains the maximum subarray sum ending at each index.', category: 'algorithm' },
            { id: '7-2', question: 'What is the time complexity of the DP approach?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctAnswer: 2, explanation: 'We process each element exactly once.', category: 'algorithm' }
        ]
    },
    {
        id: '8',
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        description: `You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
        inputFormat: 'n = 2',
        outputFormat: '2',
        constraints: ['1 ≤ n ≤ 45'],
        testCases: [
            { input: 'n = 2', output: '2', explanation: '1+1, 2' },
            { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' }
        ],
        tags: ['Math', 'Dynamic Programming', 'Memoization'],
        hints: ['The number of ways to reach step n is ways(n-1) + ways(n-2).', 'This is similar to the Fibonacci sequence.'],
        optimalSolution: "def climbStairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b",
        methodName: 'climbStairs',
        template: "class Solution:\n    def climbStairs(self, n: int) -> int:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '8-1', question: 'Why does this problem reduce to Fibonacci?', options: ['Steps are numbered', 'Ways to reach N depend on N-1 and N-2', 'It uses recursion', 'It is a math constant'], correctAnswer: 1, explanation: 'Every path to N must come from either N-1 or N-2.', category: 'approach' },
            { id: '8-2', question: 'What is the space complexity of the iterative solution?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], correctAnswer: 1, explanation: 'By only keeping the last two values, we use constant space.', category: 'algorithm' }
        ]
    },
    {
        id: '9',
        title: 'Middle of the Linked List',
        difficulty: 'Easy',
        description: `Given the head of a singly linked list, return the middle node of the linked list.\n\nIf there are two middle nodes, return the second middle node.`,
        inputFormat: 'head = [1,2,3,4,5]',
        outputFormat: '[3,4,5]',
        constraints: ['The number of nodes in the list is in the range [1, 100].', '1 ≤ Node.val ≤ 100'],
        testCases: [
            { input: 'head = [1,2,3,4,5]', output: '[3,4,5]' },
            { input: 'head = [1,2,3,4,5,6]', output: '[4,5,6]' }
        ],
        tags: ['Linked List', 'Two Pointers'],
        hints: ['Use a slow and a fast pointer.', 'The fast pointer moves twice as fast as the slow pointer.'],
        optimalSolution: "def middleNode(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow",
        methodName: 'middleNode',
        template: "class Solution:\n    def middleNode(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '9-1', question: 'How many passes do we need with the fast/slow pointer method?', options: ['Two passes', 'One pass', 'Log(n) passes', 'Zero passes'], correctAnswer: 1, explanation: 'The pointers traverse the list once.', category: 'approach' },
            { id: '9-2', question: 'What happens to the fast pointer when it reaches the end?', options: ['It stops at the middle', 'It becomes null', 'It loops back', 'It stops at the last node'], correctAnswer: 1, explanation: 'When fast hits the end, slow is exactly at the midpoint.', category: 'algorithm' }
        ]
    },
    {
        id: '10',
        title: 'Invert Binary Tree',
        difficulty: 'Easy',
        description: `Given the root of a binary tree, invert the tree, and return its root.`,
        inputFormat: 'root = [4,2,7,1,3,6,9]',
        outputFormat: '[4,7,2,9,6,3,1]',
        constraints: ['The number of nodes in the tree is in the range [0, 100].', '-100 ≤ Node.val ≤ 100'],
        testCases: [
            { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' },
            { input: 'root = [2,1,3]', output: '[2,3,1]' },
            { input: 'root = []', output: '[]' }
        ],
        tags: ['Tree', 'DFS', 'BFS'],
        hints: ['Swap the left and right children of every node.', 'You can use either recursion (DFS) or iteration (BFS).'],
        optimalSolution: "def invertTree(root):\n    if not root: return None\n    root.left, root.right = invertTree(root.right), invertTree(root.left)\n    return root",
        methodName: 'invertTree',
        template: "class Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '10-1', question: 'What type of traversal is naturally suited for inversion?', options: ['Pre-order', 'In-order', 'Post-order', 'Any recursive traversal'], correctAnswer: 3, explanation: 'A simple recursive visitor can swap children at each node.', category: 'approach' },
            { id: '10-2', question: 'What is the time complexity for a tree with N nodes?', options: ['O(log N)', 'O(N)', 'O(N²)', 'O(2^N)'], correctAnswer: 1, explanation: 'Each node is visited exactly once.', category: 'algorithm' }
        ]
    },
    {
        id: '11',
        title: 'Two Sum II - Sorted Array',
        difficulty: 'Medium',
        description: `Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.`,
        inputFormat: 'numbers = [2,7,11,15], target = 9',
        outputFormat: '[1,2]',
        constraints: ['2 ≤ numbers.length ≤ 3 * 10⁴', '-1000 ≤ numbers[i] ≤ 1000', 'Sorted in non-decreasing order.'],
        testCases: [
            { input: 'numbers = [2,7,11,15], target = 9', output: '[1,2]' },
            { input: 'numbers = [2,3,4], target = 6', output: '[1,3]' }
        ],
        tags: ['Two Pointers', 'Array', 'Binary Search'],
        hints: ['Try using two pointers, one at the start and one at the end.', 'If the sum is too small, move the left pointer.'],
        optimalSolution: "def twoSum(numbers, target):\n    l, r = 0, len(numbers) - 1\n    while l < r:\n        s = numbers[l] + numbers[r]\n        if s == target: return [l + 1, r + 1]\n        elif s < target: l += 1\n        else: r -= 1",
        methodName: 'twoSum',
        template: "class Solution:\n    def twoSum(self, numbers: List[int], target: int) -> List[int]:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '11-1', question: 'Why use two pointers instead of a hash map here?', options: ['It is faster', 'It uses O(1) extra space', 'Hash maps don\'t work for sorted arrays', 'It is easier to implement'], correctAnswer: 1, explanation: 'Since the array is sorted, two pointers can find the pair with constant extra space.', category: 'approach' },
            { id: '11-2', question: 'What to do if sum > target?', options: ['Increment left', 'Decrement right', 'Stop loop', 'Return [0,0]'], correctAnswer: 1, explanation: 'Decrementing the right pointer reduces the sum.', category: 'algorithm' }
        ]
    },
    {
        id: '12',
        title: 'Valid Anagram',
        difficulty: 'Easy',
        description: `Given two strings s and t, return true if t is an anagram of s, and false otherwise.`,
        inputFormat: 's = "anagram", t = "nagaram"',
        outputFormat: 'true',
        constraints: ['1 ≤ s.length, t.length ≤ 5 * 10⁴', 's and t consist of lowercase English letters.'],
        testCases: [
            { input: 's = "anagram", t = "nagaram"', output: 'true' },
            { input: 's = "rat", t = "car"', output: 'false' }
        ],
        tags: ['String', 'Hash Table', 'Sorting'],
        hints: ['Count the frequency of each character.', 'Alternatively, sort the strings and compare.'],
        optimalSolution: "def isAnagram(s, t):\n    if len(s) != len(t): return False\n    return sorted(s) == sorted(t)",
        methodName: 'isAnagram',
        template: "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '12-1', question: 'What is the time complexity of the sorting approach?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], correctAnswer: 1, explanation: 'Sorting takes O(n log n) time.', category: 'algorithm' },
            { id: '12-2', question: 'How can you achieve O(n) time complexity?', options: ['Using a nested loop', 'Using a hash map to count characters', 'Binary search', 'Two pointers'], correctAnswer: 1, explanation: 'Character counting takes linear time.', category: 'approach' }
        ]
    },
    {
        id: '13',
        title: 'Binary Search',
        difficulty: 'Easy',
        description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.`,
        inputFormat: 'nums = [-1,0,3,5,9,12], target = 9',
        outputFormat: '4',
        constraints: ['1 ≤ nums.length ≤ 10⁴', '-10⁴ < nums[i], target < 10⁴', 'All the integers in nums are unique.', 'nums is sorted in ascending order.'],
        testCases: [
            { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
            { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' }
        ],
        tags: ['Array', 'Binary Search'],
        hints: ['Identify the middle element.', 'Adjust your boundaries (low, high) based on comparison.'],
        optimalSolution: "def search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        m = (l + r) // 2\n        if nums[m] == target: return m\n        elif nums[m] < target: l = m + 1\n        else: r = m - 1\n    return -1",
        methodName: 'search',
        template: "class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '13-1', question: 'What is the time complexity of Binary Search?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], correctAnswer: 1, explanation: 'Each step halves the search space.', category: 'algorithm' },
            { id: '13-2', question: 'Which index should you check next after target > nums[mid]?', options: ['[0, mid-1]', '[mid+1, end]', 'mid', 'None'], correctAnswer: 1, explanation: 'The target must be in the right half.', category: 'approach' }
        ]
    },
    {
        id: '14',
        title: 'Flood Fill',
        difficulty: 'Easy',
        description: `An image is represented by an m x n integer grid image where image[i][j] represents the pixel value of the image. You are also given three integers sr, sc, and color. You should perform a flood fill on the image starting from the pixel image[sr][sc].`,
        inputFormat: 'image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2',
        outputFormat: '[[2,2,2],[2,2,0],[2,0,1]]',
        constraints: ['m == image.length', 'n == image[i].length', '1 ≤ m, n ≤ 50', '0 ≤ image[i][j], color < 2¹⁶', '0 ≤ sr < m', '0 ≤ sc < n'],
        testCases: [
            { input: 'image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2', output: '[[2,2,2],[2,2,0],[2,0,1]]' },
            { input: 'image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0', output: '[[0,0,0],[0,0,0]]' }
        ],
        tags: ['Array', 'DFS', 'BFS', 'Matrix'],
        hints: ['Perform DFS or BFS from the starting pixel.', 'Only change pixels with the same initial color.'],
        optimalSolution: "def floodFill(image, sr, sc, color):\n    old = image[sr][sc]\n    if old == color: return image\n    R, C = len(image), len(image[0])\n    def dfs(r, c):\n        if image[r][c] == old:\n            image[r][c] = color\n            if r >= 1: dfs(r-1, c)\n            if r+1 < R: dfs(r+1, c)\n            if c >= 1: dfs(r, c-1)\n            if c+1 < C: dfs(r, c+1)\n    dfs(sr, sc)\n    return image",
        methodName: 'floodFill',
        template: "class Solution:\n    def floodFill(self, image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '14-1', question: 'What happens if the starting color is same as target color?', options: ['Infinite loop', 'No changes needed', 'Error', 'Fills whole matrix'], correctAnswer: 1, explanation: 'If old == color, we should return immediately to avoid recursion infinity.', category: 'approach' },
            { id: '14-2', question: 'Which algorithm is common for flood fill?', options: ['Binary search', 'Dynamic programming', 'Depth First Search', 'Greedy'], correctAnswer: 2, explanation: 'DFS/BFS naturally visits adjacent pixels.', category: 'algorithm' }
        ]
    },
    {
        id: '15',
        title: 'Balanced Binary Tree',
        difficulty: 'Easy',
        description: `Given a binary tree, determine if it is height-balanced.`,
        inputFormat: 'root = [3,9,20,null,null,15,7]',
        outputFormat: 'true',
        constraints: ['The number of nodes in the tree is in [0, 5000].', '-10⁴ ≤ Node.val ≤ 10⁴'],
        testCases: [
            { input: 'root = [3,9,20,null,null,15,7]', output: 'true' },
            { input: 'root = [1,2,2,3,3,null,null,4,4]', output: 'false' }
        ],
        tags: ['Tree', 'DFS'],
        hints: ['Calculate height of each subtree recursively.', 'A tree is balanced if heights of children differ by at most 1.'],
        optimalSolution: "def isBalanced(root):\n    def check(node):\n        if not node: return 0\n        left = check(node.left)\n        if left == -1: return -1\n        right = check(node.right)\n        if right == -1: return -1\n        if abs(left - right) > 1: return -1\n        return max(left, right) + 1\n    return check(root) != -1",
        methodName: 'isBalanced',
        template: "class Solution:\n    def isBalanced(self, root: Optional[TreeNode]) -> bool:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '15-1', question: 'What is the definition of a height-balanced tree?', options: ['Full binary tree', 'Left/right height differ by <= 1', 'Always 2 children', 'Sorted inorder'], correctAnswer: 1, explanation: 'Balanced means the absolute height difference of subtrees is max 1.', category: 'approach' },
            { id: '15-2', question: 'What can we return from a recursive height function to signal unbalance?', options: ['Zero', 'Infinity', '-1', 'True'], correctAnswer: 2, explanation: 'Returning -1 allows bubbling up the unbalanced status.', category: 'algorithm' }
        ]
    },
    {
        id: '16',
        title: 'Linked List Cycle',
        difficulty: 'Easy',
        description: `Given head, the head of a linked list, determine if the linked list has a cycle in it.`,
        inputFormat: 'head = [3,2,0,-4], pos = 1',
        outputFormat: 'true',
        constraints: ['Nodes in list [0, 10⁴]', '-10⁵ ≤ Node.val ≤ 10⁵'],
        testCases: [
            { input: 'head = [3,2,0,-4], pos = 1', output: 'true' },
            { input: 'head = [1,2], pos = 0', output: 'true' },
            { input: 'head = [1], pos = -1', output: 'false' }
        ],
        tags: ['Linked List', 'Two Pointers', 'Hash Table'],
        hints: ["Use Floyd's Cycle-Finding Algorithm (slow/fast pointers).", 'If pointers meet, there is a cycle.'],
        optimalSolution: "def hasCycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast: return True\n    return False",
        methodName: 'hasCycle',
        template: "class Solution:\n    def hasCycle(self, head: Optional[ListNode]) -> bool:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '16-1', question: 'What is the space complexity of slow/fast pointers?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correctAnswer: 2, explanation: 'Only two pointer variables are used.', category: 'algorithm' },
            { id: '16-2', question: 'What happens if there is no cycle?', options: ['Pointers meet anyway', 'Fast reaches None', 'Infinite loop', 'Slow catches fast'], correctAnswer: 1, explanation: 'The fast pointer will reach the end of the list.', category: 'approach' }
        ]
    },
    {
        id: '17',
        title: 'Implement Queue using Stacks',
        difficulty: 'Easy',
        description: `Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (push, peek, pop, and empty).`,
        inputFormat: '["MyQueue", "push", "push", "peek", "pop", "empty"]\n[[], [1], [2], [], [], []]',
        outputFormat: '[null, null, null, 1, 1, false]',
        constraints: ['1 ≤ x ≤ 9', 'At most 100 calls', 'All calls are valid'],
        testCases: [
            { input: '["MyQueue", "push", "push", "peek", "pop", "empty"]\n[[], [1], [2], [], [], []]', output: '[null, null, null, 1, 1, false]' }
        ],
        tags: ['Stack', 'Design', 'Queue'],
        hints: ['Use one stack for input and another for output.', 'Transfer from input to output when output is empty.'],
        optimalSolution: "class MyQueue:\n    def __init__(self):\n        self.s1, self.s2 = [], []\n    def push(self, x):\n        self.s1.append(x)\n    def pop(self):\n        self.peek()\n        return self.s2.pop()\n    def peek(self):\n        if not self.s2:\n            while self.s1: self.s2.append(self.s1.pop())\n        return self.s2[-1]\n    def empty(self):\n        return not self.s1 and not self.s2",
        methodName: '__init__',
        template: "class MyQueue:\n    def __init__(self):\n        pass\n    def push(self, x: int) -> None:\n        pass\n    def pop(self) -> int:\n        pass\n    def peek(self) -> int:\n        pass\n    def empty(self) -> bool:\n        pass",
        mcqs: [
            { id: '17-1', question: 'What is the amortized cost of the pop operation?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 0, explanation: 'While one pop can be O(n), the average is O(1).', category: 'algorithm' },
            { id: '17-2', question: 'Why use two stacks instead of one?', options: ['Stacks are FIFO', 'One stack is enough', 'Stacks are LIFO, second reverses order', 'Faster memory access'], correctAnswer: 2, explanation: 'The second stack reverses the LIFO order back to FIFO.', category: 'approach' }
        ]
    },
    {
        id: '18',
        title: 'First Bad Version',
        difficulty: 'Easy',
        description: `You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad.`,
        inputFormat: 'n = 5, bad = 4',
        outputFormat: '4',
        constraints: ['1 ≤ bad ≤ n ≤ 2³¹ - 1'],
        testCases: [
            { input: 'n = 5, bad = 4', output: '4' },
            { input: 'n = 1, bad = 1', output: '1' }
        ],
        tags: ['Binary Search', 'Interactive'],
        hints: ['Minimize the number of API calls.', 'Use binary search to find the intersection.'],
        optimalSolution: "def firstBadVersion(n):\n    l, r = 1, n\n    while l < r:\n        m = (l + r) // 2\n        if isBadVersion(m): r = m\n        else: l = m + 1\n    return l",
        methodName: 'firstBadVersion',
        template: "class Solution:\n    def firstBadVersion(self, n: int) -> int:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '18-1', question: 'Why is binary search efficient here?', options: ['It avoids API calls totally', 'Reduces calls from O(n) to O(log n)', 'It is recursive', 'Works on unsorted data'], correctAnswer: 1, explanation: 'Binary search exponentially reduces the search space.', category: 'algorithm' },
            { id: '18-2', question: 'What should the logic be when isBadVersion(mid) is true?', options: ['Look in [mid+1, end]', 'Look in [start, mid]', 'mid is the answer', 'Restart'], correctAnswer: 1, explanation: 'If mid is bad, the first bad version is mid or before mid.', category: 'approach' }
        ]
    },
    {
        id: '19',
        title: 'Ransom Note',
        difficulty: 'Easy',
        description: `Given two strings ransomNote and magazine, return true if ransomNote can be constructed by using the letters from magazine and false otherwise.`,
        inputFormat: 'ransomNote = "a", magazine = "b"',
        outputFormat: 'false',
        constraints: ['1 ≤ ransomNote.length, magazine.length ≤ 10⁵', 'Lowercase English letters only.'],
        testCases: [
            { input: 'ransomNote = "a", magazine = "b"', output: 'false' },
            { input: 'ransomNote = "aa", magazine = "ab"', output: 'false' },
            { input: 'ransomNote = "aa", magazine = "aab"', output: 'true' }
        ],
        tags: ['Hash Table', 'String', 'Counting'],
        hints: ['Count the available characters in the magazine.', 'Check if the ransom note needs more than available.'],
        optimalSolution: "def canConstruct(ransomNote, magazine):\n    counts = collections.Counter(magazine)\n    for char in ransomNote:\n        if counts[char] <= 0: return False\n        counts[char] -= 1\n    return True",
        methodName: 'canConstruct',
        template: "class Solution:\n    def canConstruct(self, ransomNote: str, magazine: str) -> bool:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '19-1', question: 'How can you avoid high space usage for ASCII?', options: ['Using bitmasks', 'Fixed array of size 26', 'Sorting in-place', 'Recursion'], correctAnswer: 1, explanation: 'An array of size 26 is enough for lowercase letters.', category: 'approach' },
            { id: '19-2', question: 'What is the complexity if we count magazine once?', options: ['O(R * M)', 'O(R + M)', 'O(R log R)', 'O(1)'], correctAnswer: 1, explanation: 'One pass over each string is linear.', category: 'algorithm' }
        ]
    },
    {
        id: '20',
        title: 'Diameter of Binary Tree',
        difficulty: 'Easy',
        description: `Given the root of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree.`,
        inputFormat: 'root = [1,2,3,4,5]',
        outputFormat: '3',
        constraints: ['Nodes in tree [1, 10⁴]', '-100 ≤ Node.val ≤ 100'],
        testCases: [
            { input: 'root = [1,2,3,4,5]', output: '3', explanation: 'Path [4,2,5,1,3] or [5,2,4] etc.' },
            { input: 'root = [1,2]', output: '1' }
        ],
        tags: ['Tree', 'DFS'],
        hints: ['The longest path may or may not pass through the root.', 'Diameter at a node = left height + right height.'],
        optimalSolution: "def diameterOfBinaryTree(root):\n    self.res = 0\n    def depth(node):\n        if not node: return 0\n        l, r = depth(node.left), depth(node.right)\n        self.res = max(self.res, l + r)\n        return max(l, r) + 1\n    depth(root)\n    return self.res",
        methodName: 'diameterOfBinaryTree',
        template: "class Solution:\n    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '20-1', question: 'Does the longest path always pass through the root?', options: ['Yes', 'No', 'Only for full trees', 'Only for balanced trees'], correctAnswer: 1, explanation: 'It could be entirely within the subtrees of the root.', category: 'approach' },
            { id: '20-2', question: 'What is the recurring relation to find diameter at a node?', options: ['Min depth', 'Max height', 'Left depth + Right depth', 'Left height * Right height'], correctAnswer: 2, explanation: 'Sum of depths from children gives the path passing through the current node.', category: 'algorithm' }
        ]
    },
    {
        id: '21',
        title: 'Lowest Common Ancestor of a Binary Search Tree',
        difficulty: 'Easy',
        description: `Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.`,
        inputFormat: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8',
        outputFormat: '6',
        constraints: ['Nodes in tree [2, 10⁵]', '-10⁹ ≤ Node.val ≤ 10⁹', 'All values unique.', 'p != q', 'p, q exist in BST.'],
        testCases: [
            { input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8', output: '6' },
            { input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4', output: '2' }
        ],
        tags: ['Tree', 'BST', 'DFS'],
        hints: ['Leverage the BST property (left < root < right).', 'If both p and q are smaller than current, go left.'],
        optimalSolution: "def lowestCommonAncestor(root, p, q):\n    while root:\n        if p.val < root.val and q.val < root.val: root = root.left\n        elif p.val > root.val and q.val > root.val: root = root.right\n        else: return root",
        methodName: 'lowestCommonAncestor',
        template: "class Solution:\n    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':\n        # Write your code here\n        pass",
        mcqs: [
            { id: '21-1', question: 'What BST property is most useful here?', options: ['Balanced height', 'Left < Root < Right', 'All levels full', 'Sorted by insertion'], correctAnswer: 1, explanation: 'The sorting property allows us to decide which subtree to explore.', category: 'approach' },
            { id: '21-2', question: 'When is the current node the LCA?', options: ['Always', 'If p and q are in different subtrees', 'If it is the root', 'If it has no children'], correctAnswer: 1, explanation: 'The split point in values is the lowest common ancestor.', category: 'algorithm' }
        ]
    },
    {
        id: '22',
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        description: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.`,
        inputFormat: 'nums = [1,2,3,1]',
        outputFormat: 'true',
        constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁹ ≤ nums[i] ≤ 10⁹'],
        testCases: [
            { input: 'nums = [1,2,3,1]', output: 'true' },
            { input: 'nums = [1,2,3,4]', output: 'false' },
            { input: 'nums = [1,1,1,3,3,4,3,2,4,2]', output: 'true' }
        ],
        tags: ['Array', 'Hash Table', 'Sorting'],
        hints: ['Use a set to keep track of seen elements.', 'Or sort the array and check adjacent elements.'],
        optimalSolution: "def containsDuplicate(nums):\n    return len(set(nums)) != len(nums)",
        methodName: 'containsDuplicate',
        template: "class Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '22-1', question: 'What is the space complexity of using a set?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 1, explanation: 'In the worst case, we store all n elements in the set.', category: 'algorithm' },
            { id: '22-2', question: 'Which approach uses O(1) space?', options: ['Using a set', 'Sorting the array', 'Nested loops', 'None'], correctAnswer: 1, explanation: 'Sorting in-place uses heap space but O(1) extra space (if sorting allows).', category: 'approach' }
        ]
    },
    {
        id: '23',
        title: 'Insert Interval',
        difficulty: 'Medium',
        description: `You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] represent the start and the end of the ith interval and intervals is sorted in ascending order by starti. You are also given an interval newInterval = [start, end] that represents the start and end of another interval.\n\nInsert newInterval into intervals such that intervals is still sorted in ascending order by starti and intervals still does not have any overlapping intervals (merge overlapping intervals if necessary).`,
        inputFormat: 'intervals = [[1,3],[6,9]], newInterval = [2,5]',
        outputFormat: '[[1,5],[6,9]]',
        constraints: ['0 ≤ intervals.length ≤ 10⁴', 'intervals[i].length == 2', '0 ≤ starti ≤ endi ≤ 10⁵', 'intervals sorted by starti', 'newInterval.length == 2'],
        testCases: [
            { input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]', output: '[[1,5],[6,9]]' },
            { input: 'intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]', output: '[[1,2],[3,10],[12,16]]' }
        ],
        tags: ['Array'],
        hints: ['Iterate through intervals and split into before, during, and after overlapping.', 'Merge all overlapping parts into one.'],
        optimalSolution: "def insert(intervals, newInterval):\n    res = []\n    for i in range(len(intervals)):\n        if newInterval[1] < intervals[i][0]:\n            res.append(newInterval)\n            return res + intervals[i:]\n        elif newInterval[0] > intervals[i][1]:\n            res.append(intervals[i])\n        else:\n            newInterval = [min(newInterval[0], intervals[i][0]), max(newInterval[1], intervals[i][1])]\n    res.append(newInterval)\n    return res",
        methodName: 'insert',
        template: "class Solution:\n    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '23-1', question: 'What is the maximum number of intervals merged?', options: ['All n intervals', 'At most 2', 'Only adjacent ones', 'Log(n)'], correctAnswer: 0, explanation: 'One new interval can overlap and merge all existing ones.', category: 'algorithm' },
            { id: '23-2', question: 'How do you determine overlap for [s1, e1] and [s2, e2]?', options: ['s1 == s2', 'e1 >= s2 and e2 >= s1', 's1 < e2', 'e1 > s2'], correctAnswer: 1, explanation: 'Intervals overlap if the start of one is before or at the end of the other, and vice-versa.', category: 'approach' }
        ]
    },
    {
        id: '24',
        title: '01 Matrix',
        difficulty: 'Medium',
        description: `Given an m x n binary matrix mat, return the distance of the nearest 0 for each cell. The distance between two adjacent cells is 1.`,
        inputFormat: 'mat = [[0,0,0],[0,1,0],[0,0,0]]',
        outputFormat: '[[0,0,0],[0,1,0],[0,0,0]]',
        constraints: ['m == mat.length', 'n == mat[i].length', '1 ≤ m, n ≤ 10⁴', '1 ≤ m * n ≤ 10⁴', 'At least one 0 in mat.'],
        testCases: [
            { input: 'mat = [[0,0,0],[0,1,0],[0,0,0]]', output: '[[0,0,0],[0,1,0],[0,0,0]]' },
            { input: 'mat = [[0,0,0],[0,1,0],[1,1,1]]', output: '[[0,0,0],[0,1,0],[1,2,1]]' }
        ],
        tags: ['Array', 'Dynamic Programming', 'BFS'],
        hints: ['Use Multi-source BFS starting from all 0s.', 'Update distance of neighbors.'],
        optimalSolution: "def updateMatrix(mat):\n    R, C = len(mat), len(mat[0])\n    q = collections.deque()\n    for r in range(R):\n        for c in range(C):\n            if mat[r][c] == 0: q.append((r, c))\n            else: mat[r][c] = '#'\n    while q:\n        r, c = q.popleft()\n        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:\n            nr, nc = r+dr, c+dc\n            if 0<=nr<R and 0<=nc<C and mat[nr][nc] == '#':\n                mat[nr][nc] = mat[r][c] + 1\n                q.append((nr, nc))\n    return mat",
        methodName: 'updateMatrix',
        template: "class Solution:\n    def updateMatrix(self, mat: List[List[int]]) -> List[List[int]]:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '24-1', question: 'Why is BFS better than DFS for shortest distance here?', options: ['DFS is slow', 'BFS explores level by level', 'DFS uses more memory', 'BFS works on trees only'], correctAnswer: 1, explanation: 'BFS expands layer by layer, guaranteeing the first visit is the shortest.', category: 'approach' },
            { id: '24-2', question: 'What is Multi-source BFS?', options: ['Running BFS multiple times', 'Starting BFS with many nodes in the queue', 'BFS with multiple targets', 'None'], correctAnswer: 1, explanation: 'Initializing the queue with all sources (0s) processes distances in parallel.', category: 'algorithm' }
        ]
    },
    {
        id: '25',
        title: 'K Closest Points to Origin',
        difficulty: 'Medium',
        description: `Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin (0, 0).`,
        inputFormat: 'points = [[1,3],[-2,2]], k = 1',
        outputFormat: '[[-2,2]]',
        constraints: ['1 ≤ k ≤ points.length ≤ 10⁴', '-10⁴ ≤ xi, yi ≤ 10⁴'],
        testCases: [
            { input: 'points = [[1,3],[-2,2]], k = 1', output: '[[-2,2]]' },
            { input: 'points = [[3,3],[5,-1],[-2,4]], k = 2', output: '[[3,3],[-2,4]]' }
        ],
        tags: ['Array', 'Math', 'Divide and Conquer', 'Heap', 'Sorting'],
        hints: ['Calculate Euclidean distance for all points.', 'Use a Max Heap of size K to keep the smallest distances.'],
        optimalSolution: "def kClosest(points, k):\n    return sorted(points, key=lambda p: p[0]**2 + p[1]**2)[:k]",
        methodName: 'kClosest',
        template: "class Solution:\n    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '25-1', question: 'What is the benefit of a heap over sorting?', options: ['Always faster', 'Uses less space O(K)', 'Better for large arrays', 'None'], correctAnswer: 1, explanation: 'A heap approach uses O(K) space instead of O(N).', category: 'approach' },
            { id: '25-2', question: 'Distance of (x,y) to origin?', options: ['x+y', 'x*y', 'sqrt(x²+y²)', 'abs(x-y)'], correctAnswer: 2, explanation: 'Euclidean distance formula.', category: 'algorithm' }
        ]
    },
    {
        id: '26',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        description: `Given a string s, find the length of the longest substring without repeating characters.`,
        inputFormat: 's = "abcabcbb"',
        outputFormat: '3',
        constraints: ['0 ≤ s.length ≤ 5 * 10⁴', 's consists of English letters, digits, symbols and spaces.'],
        testCases: [
            { input: 's = "abcabcbb"', output: '3', explanation: '"abc"' },
            { input: 's = "bbbbb"', output: '1', explanation: '"b"' },
            { input: 's = "pwwkew"', output: '3', explanation: '"wke"' }
        ],
        tags: ['Hash Table', 'String', 'Sliding Window'],
        hints: ['Use two pointers as a sliding window.', 'Use a set/map to store indices of characters.'],
        optimalSolution: "def lengthOfLongestSubstring(s):\n    char_map = {}\n    left = res = 0\n    for right in range(len(s)):\n        if s[right] in char_map:\n            left = max(left, char_map[s[right]] + 1)\n        char_map[s[right]] = right\n        res = max(res, right - left + 1)\n    return res",
        methodName: 'lengthOfLongestSubstring',
        template: "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '26-1', question: 'What does the sliding window represent here?', options: ['A sorted subarray', 'Candidate substring without duplicates', 'The whole string', 'Null'], correctAnswer: 1, explanation: 'The window encapsulates the current valid substring being measured.', category: 'approach' },
            { id: '26-2', question: 'Why update left to max(left, char_map[s[right]]+1)?', options: ['To shrink the window effectively', 'To skip already repeated chars', 'Both A and B', 'Faster iteration'], correctAnswer: 2, explanation: 'It jumps the left pointer to avoid the duplicate character efficiently.', category: 'algorithm' }
        ]
    },
    {
        id: '27',
        title: '3Sum',
        difficulty: 'Medium',
        description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.`,
        inputFormat: 'nums = [-1,0,1,2,-1,-4]',
        outputFormat: '[[-1,-1,2],[-1,0,1]]',
        constraints: ['3 ≤ nums.length ≤ 3000', '-10⁵ ≤ nums[i] ≤ 10⁵'],
        testCases: [
            { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
            { input: 'nums = [0,1,1]', output: '[]' },
            { input: 'nums = [0,0,0]', output: '[[0,0,0]]' }
        ],
        tags: ['Array', 'Two Pointers', 'Sorting'],
        hints: ['Sort the array first.', 'Fixed one element and use two pointers for the rest.'],
        optimalSolution: "def threeSum(nums):\n    res = []\n    nums.sort()\n    for i, a in enumerate(nums):\n        if i > 0 and a == nums[i-1]: continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            three_sum = a + nums[l] + nums[r]\n            if three_sum > 0: r -= 1\n            elif three_sum < 0: l += 1\n            else:\n                res.append([a, nums[l], nums[r]])\n                l += 1\n                while nums[l] == nums[l-1] and l < r: l += 1\n    return res",
        methodName: 'threeSum',
        template: "class Solution:\n    def threeSum(self, nums: List[int]) -> List[List[int]]:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '27-1', question: 'How to avoid duplicate triplets?', options: ['Using a set', 'Checking adjacent sorted elements', 'Both A and B', 'Sorting result'], correctAnswer: 2, explanation: 'Both sorting + set OR sorting + skipping adjacents work.', category: 'approach' },
            { id: '27-2', question: 'Complexity after sorting?', options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(n³)'], correctAnswer: 1, explanation: 'Loop over array with two pointers inside is O(n²).', category: 'algorithm' }
        ]
    },
    {
        id: '28',
        title: 'Binary Tree Level Order Traversal',
        difficulty: 'Medium',
        description: `Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).`,
        inputFormat: 'root = [3,9,20,null,null,15,7]',
        outputFormat: '[[3],[9,20],[15,7]]',
        constraints: ['Nodes in tree [0, 2000]', '-1000 ≤ Node.val ≤ 1000'],
        testCases: [
            { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
            { input: 'root = [1]', output: '[[1]]' },
            { input: 'root = []', output: '[]' }
        ],
        tags: ['Tree', 'BFS', 'Binary Tree'],
        hints: ['Use a queue for Breadth-First Search (BFS).', 'Process nodes level by level by keeping track of level size.'],
        optimalSolution: "def levelOrder(root):\n    if not root: return []\n    res, q = [], collections.deque([root])\n    while q:\n        level = []\n        for _ in range(len(q)):\n            node = q.popleft()\n            level.append(node.val)\n            if node.left: q.append(node.left)\n            if node.right: q.append(node.right)\n        res.append(level)\n    return res",
        methodName: 'levelOrder',
        template: "class Solution:\n    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '28-1', question: 'What is the main advantage of level-order traversal?', options: ['Finds shortest path', 'Visits leaf nodes first', 'Low memory', 'Always sorted'], correctAnswer: 0, explanation: 'BFS (level order) finds the shortest path in unweighted graphs/trees.', category: 'approach' },
            { id: '28-2', question: 'Which data structure is essential for iterative BFS?', options: ['Stack', 'Queue', 'Dictionary', 'Linked List'], correctAnswer: 1, explanation: 'A queue maintains the FIFO order needed for level traversal.', category: 'data-structure' }
        ]
    },
    {
        id: '29',
        title: 'Clone Graph',
        difficulty: 'Medium',
        description: `Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.`,
        inputFormat: 'adjList = [[2,4],[1,3],[2,4],[1,3]]',
        outputFormat: '[[2,4],[1,3],[2,4],[1,3]]',
        constraints: ['1 ≤ Node.val ≤ 100', 'Unique values.', 'Number of nodes [0, 100]', 'No repeated edges.'],
        testCases: [
            { input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]' }
        ],
        tags: ['Hash Table', 'DFS', 'BFS', 'Graph'],
        hints: ['Use a dictionary to map old nodes to their clones.', 'Explore the graph using DFS or BFS.'],
        optimalSolution: "def cloneGraph(node):\n    if not node: return None\n    old_to_new = {node: Node(node.val)}\n    def dfs(curr):\n        for nei in curr.neighbors:\n            if nei not in old_to_new:\n                old_to_new[nei] = Node(nei.val)\n                dfs(nei)\n            old_to_new[curr].neighbors.append(old_to_new[nei])\n    dfs(node)\n    return old_to_new[node]",
        methodName: 'cloneGraph',
        template: "class Solution:\n    def cloneGraph(self, node: 'Node') -> 'Node':\n        # Write your code here\n        pass",
        mcqs: [
            { id: '29-1', question: 'Why is a hash map needed during cloning?', options: ['To speed up lookups', 'To track visited nodes and their clones', 'To sort edges', 'None'], correctAnswer: 1, explanation: 'It prevents infinite recursion in cyclic graphs and maps original nodes to clones.', category: 'approach' },
            { id: '29-2', question: 'Complexity of cloning a graph with V vertices and E edges?', options: ['O(V)', 'O(E)', 'O(V+E)', 'O(V*E)'], correctAnswer: 2, explanation: 'We visit every node and edge once.', category: 'algorithm' }
        ]
    },
    {
        id: '30',
        title: 'Course Schedule',
        difficulty: 'Medium',
        description: `There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.\n\nReturn true if you can finish all courses. Otherwise, return false.`,
        inputFormat: 'numCourses = 2, prerequisites = [[1,0]]',
        outputFormat: 'true',
        constraints: ['1 ≤ numCourses ≤ 2000', '0 ≤ prerequisites.length ≤ 5000', 'prerequisites[i].length == 2', 'Unique prerequisites.'],
        testCases: [
            { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true' },
            { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false' }
        ],
        tags: ['DFS', 'BFS', 'Graph', 'Topological Sort'],
        hints: ['Detect a cycle in the directed graph.', 'Use Kahn\'s algorithm or DFS for cycle detection.'],
        optimalSolution: "def canFinish(numCourses, prerequisites):\n    preMap = { i:[] for i in range(numCourses) }\n    for crs, pre in prerequisites: preMap[crs].append(pre)\n    visiting = set()\n    def dfs(crs):\n        if crs in visiting: return False\n        if preMap[crs] == []: return True\n        visiting.add(crs)\n        for pre in preMap[crs]:\n            if not dfs(pre): return False\n        visiting.remove(crs)\n        preMap[crs] = []\n        return True\n    for crs in range(numCourses):\n        if not dfs(crs): return False\n    return True",
        methodName: 'canFinish',
        template: "class Solution:\n    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '30-1', question: 'What mathematical concept represents this problem?', options: ['Undirected graph', 'Directed Acyclic Graph (DAG)', 'Full tree', 'Perfect matching'], correctAnswer: 1, explanation: 'Course dependencies form a directed graph; if it has no cycles (is a DAG), courses can be finished.', category: 'approach' },
            { id: '30-2', question: 'What to detect to return false?', options: ['Leaf nodes', 'Cycles', 'Islands', 'Source nodes'], correctAnswer: 1, explanation: 'A cycle means mutual dependency, which is impossible to fulfill.', category: 'algorithm' }
        ]
    },
    {
        id: '31',
        title: 'Coin Change',
        difficulty: 'Medium',
        description: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.`,
        inputFormat: 'coins = [1,2,5], amount = 11',
        outputFormat: '3',
        constraints: ['1 ≤ coins.length ≤ 12', '1 ≤ coins[i] ≤ 2³¹ - 1', '0 ≤ amount ≤ 10⁴'],
        testCases: [
            { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
            { input: 'coins = [2], amount = 3', output: '-1' },
            { input: 'coins = [1], amount = 0', output: '0' }
        ],
        tags: ['Array', 'Dynamic Programming', 'BFS'],
        hints: ['Use dynamic programming with a 1D array.', 'dp[i] results from min(dp[i], dp[i-coin] + 1).'],
        optimalSolution: "def coinChange(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if a - c >= 0:\n                dp[a] = min(dp[a], 1 + dp[a - c])\n    return dp[amount] if dp[amount] != float('inf') else -1",
        methodName: 'coinChange',
        template: "class Solution:\n    def coinChange(self, coins: List[int], amount: int) -> int:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '31-1', question: 'What does dp[i] represent in the DP approach?', options: ['Total coins', 'Minimum coins for amount i', 'Maximum coins', 'Index of coin'], correctAnswer: 1, explanation: 'The DP state stores the optimal result for each sub-amount.', category: 'approach' },
            { id: '31-2', question: 'Is the greedy approach (largest coin first) optimal for all coin systems?', options: ['Yes', 'No', 'Only for [1,5,10]', 'Only for powers of 2'], correctAnswer: 1, explanation: 'Greedy fails for systems like [1, 3, 4] for amount 6.', category: 'algorithm' }
        ]
    },
    {
        id: '32',
        title: 'Product of Array Except Self',
        difficulty: 'Medium',
        description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.`,
        inputFormat: 'nums = [1,2,3,4]',
        outputFormat: '[24,12,8,6]',
        constraints: ['2 ≤ nums.length ≤ 10⁵', '-30 ≤ nums[i] ≤ 30', 'Product fits in 32-bit integer.'],
        testCases: [
            { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
            { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' }
        ],
        tags: ['Array', 'Prefix Sum'],
        hints: ['Use two passes: one for prefix products and one for suffix products.', 'Calculate the running product from left and right.'],
        optimalSolution: "def productExceptSelf(nums):\n    res = [1] * len(nums)\n    prefix = 1\n    for i in range(len(nums)):\n        res[i] = prefix\n        prefix *= nums[i]\n    postfix = 1\n    for i in range(len(nums) - 1, -1, -1):\n        res[i] *= postfix\n        postfix *= nums[i]\n    return res",
        methodName: 'productExceptSelf',
        template: "class Solution:\n    def productExceptSelf(self, nums: List[int]) -> List[int]:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '32-1', question: 'Why is division not allowed for "all except self"?', options: ['It is too slow', 'Hard to handle zero', 'Complexity too high', 'None'], correctAnswer: 1, explanation: 'Division makes it difficult to handle cases where one or more elements are zero.', category: 'approach' },
            { id: '32-2', question: 'What is the space complexity if we exclude the output array?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 0, explanation: 'By calculating postfix on the fly into the result, we use no extra space.', category: 'algorithm' }
        ]
    },
    {
        id: '33',
        title: 'Min Stack',
        difficulty: 'Medium',
        description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.`,
        inputFormat: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]',
        outputFormat: '[null,null,null,null,-3,null,0,-2]',
        constraints: ['-2³¹ ≤ val ≤ 2³¹ - 1', 'Methods called at most 3 * 10⁴ times.'],
        testCases: [
            { input: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]', output: '[null,null,null,null,-3,null,0,-2]' }
        ],
        tags: ['Stack', 'Design'],
        hints: ['Keep a second stack to track the minimum values.', 'Or store pairs of (value, current_min) in a single stack.'],
        optimalSolution: "class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.minStack = []\n    def push(self, val):\n        self.stack.append(val)\n        val = min(val, self.minStack[-1] if self.minStack else val)\n        self.minStack.append(val)\n    def pop(self):\n        self.stack.pop()\n        self.minStack.pop()\n    def top(self):\n        return self.stack[-1]\n    def getMin(self):\n        return self.minStack[-1]",
        methodName: '__init__',
        template: "class MinStack:\n    def __init__(self):\n        pass\n    def push(self, val: int) -> None:\n        pass\n    def pop(self) -> None:\n        pass\n    def top(self) -> int:\n        pass\n    def getMin(self) -> int:\n        pass",
        mcqs: [
            { id: '33-1', question: 'What is the time complexity of getMin()?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n log n)'], correctAnswer: 1, explanation: 'By keeping a min-tracking stack, we get it in constant time.', category: 'algorithm' },
            { id: '33-2', question: 'How do you update the minStack on push(x)?', options: ['Append x', 'Append min(x, old_min)', 'Sort the stack', 'Replace old min'], correctAnswer: 1, explanation: 'The minStack must store the minimum among all elements currently beneath it.', category: 'approach' }
        ]
    },
    {
        id: '34',
        title: 'Validate Binary Search Tree',
        difficulty: 'Medium',
        description: `Given the root of a binary tree, determine if it is a valid binary search tree (BST).`,
        inputFormat: 'root = [2,1,3]',
        outputFormat: 'true',
        constraints: ['Nodes in tree [1, 10⁴]', '-2³¹ ≤ Node.val ≤ 2³¹ - 1'],
        testCases: [
            { input: 'root = [2,1,3]', output: 'true' },
            { input: 'root = [5,1,4,null,null,3,6]', output: 'false', explanation: 'Root is 5, but its right child\'s left child is 3.' }
        ],
        tags: ['Tree', 'DFS', 'Inorder Traversal'],
        hints: ['Use recursion with min and max boundaries.', 'Alternatively, use inorder traversal and check if it is sorted.'],
        optimalSolution: "def isValidBST(root):\n    def valid(node, low, high):\n        if not node: return True\n        if not (low < node.val < high): return False\n        return valid(node.left, low, node.val) and valid(node.right, node.val, high)\n    return valid(root, float('-inf'), float('inf'))",
        methodName: 'isValidBST',
        template: "class Solution:\n    def isValidBST(self, root: Optional[TreeNode]) -> bool:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '34-1', question: 'Why is comparing node.val with only immediately children insufficient?', options: ['It is sufficient', 'BST property must hold for all descendants', 'Children might be null', 'None'], correctAnswer: 1, explanation: 'All nodes in the left subtree must be less than the root, not just the direct left child.', category: 'approach' },
            { id: '34-2', question: 'What is the property of inorder traversal for a valid BST?', options: ['Sorted in descending order', 'Sorted in non-descending order', 'Random values', 'All values are unique'], correctAnswer: 1, explanation: 'Inorder traversal of a BST yields elements in strictly increasing order.', category: 'algorithm' }
        ]
    },
    {
        id: '35',
        title: 'Number of Islands',
        difficulty: 'Medium',
        description: `Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.`,
        inputFormat: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        outputFormat: '1',
        constraints: ['m == grid.length', 'n == grid[i].length', '1 ≤ m, n ≤ 300', 'grid[i][j] is "0" or "1"'],
        testCases: [
            { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
            { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' }
        ],
        tags: ['Array', 'DFS', 'BFS', 'Matrix'],
        hints: ['Traverse the grid; when you hit land (1), start a DFS/BFS to mark the whole island visited.', 'Count each time you start a new search.'],
        optimalSolution: "def numIslands(grid):\n    if not grid: return 0\n    R, C = len(grid), len(grid[0])\n    visit = set()\n    islands = 0\n    def bfs(r, c):\n        q = collections.deque([(r,c)])\n        visit.add((r,c))\n        while q:\n            row, col = q.popleft()\n            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:\n                nr, nc = row+dr, col+dc\n                if 0<=nr<R and 0<=nc<C and grid[nr][nc] == '1' and (nr,nc) not in visit:\n                    q.append((nr,nc))\n                    visit.add((nr,nc))\n    for r in range(R):\n        for c in range(C):\n            if grid[r][c] == '1' and (r,c) not in visit:\n                islands += 1\n                bfs(r, c)\n    return islands",
        methodName: 'numIslands',
        template: "class Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '35-1', question: 'How can you avoid extra space for the "visit" set?', options: ['Use a smaller set', 'Mark visited cells in-place (e.g., set to "2")', 'Use recursion', 'Impossible'], correctAnswer: 1, explanation: 'Mutating the input grid to mark visited nodes saves O(m*n) space.', category: 'approach' },
            { id: '35-2', question: 'What is the time complexity if we check every cell once?', options: ['O(m*n)', 'O(m+n)', 'O(k)', 'O(m²)'], correctAnswer: 0, explanation: 'We visit each cell exactly once in the grid.', category: 'algorithm' }
        ]
    },
    {
        id: '36',
        title: 'Rotting Oranges',
        difficulty: 'Medium',
        description: `You are given an m x n grid where each cell can have one of three values: 0 (empty), 1 (fresh), 2 (rotten).\n\nEvery minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten.\n\nReturn the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.`,
        inputFormat: 'grid = [[2,1,1],[1,1,0],[0,1,1]]',
        outputFormat: '4',
        constraints: ['m == grid.length', 'n == grid[i].length', '1 ≤ m, n ≤ 10', 'grid[i][j] is 0, 1, or 2.'],
        testCases: [
            { input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', output: '4' },
            { input: 'grid = [[2,1,1],[0,1,1],[1,0,1]]', output: '-1' },
            { input: 'grid = [[0,2]]', output: '0' }
        ],
        tags: ['Array', 'BFS', 'Matrix'],
        hints: ['Use Multi-source BFS starting with all initially rotten oranges.', 'Track the number of fresh oranges remaining.'],
        optimalSolution: "def orangesRotting(grid):\n    q = collections.deque()\n    fresh = 0\n    R, C = len(grid), len(grid[0])\n    for r in range(R):\n        for c in range(C):\n            if grid[r][c] == 1: fresh += 1\n            if grid[r][c] == 2: q.append((r, c))\n    time = 0\n    while q and fresh > 0:\n        for _ in range(len(q)):\n            r, c = q.popleft()\n            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:\n                nr, nc = r+dr, c+dc\n                if 0<=nr<R and 0<=nc<C and grid[nr][nc] == 1:\n                    grid[nr][nc] = 2\n                    q.append((nr, nc))\n                    fresh -= 1\n        time += 1\n    return time if fresh == 0 else -1",
        methodName: 'orangesRotting',
        template: "class Solution:\n    def orangesRotting(self, grid: List[List[int]]) -> int:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '36-1', question: 'Why is BFS suitable for modeling "time minutes"?', options: ['BFS is faster', 'BFS explores level-by-level (minute-by-minute)', 'DFS is impossible', 'None'], correctAnswer: 1, explanation: 'Each layer of the BFS represents one minute of the rotting process.', category: 'approach' },
            { id: '36-2', question: 'What to return if there are fresh oranges left after BFS?', options: ['0', 'Total minutes', '-1', 'Infinity'], correctAnswer: 2, explanation: 'If some fresh oranges never rot, it is impossible to complete.', category: 'approach' }
        ]
    },
    {
        id: '37',
        title: 'Search in Rotated Sorted Array',
        difficulty: 'Medium',
        description: `There is an integer array nums sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length).\n\nGiven the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.`,
        inputFormat: 'nums = [4,5,6,7,0,1,2], target = 0',
        outputFormat: '4',
        constraints: ['1 ≤ nums.length ≤ 5000', '-10⁴ ≤ nums[i] ≤ 10⁴', 'Unique values.', 'O(log n) time complexity required.'],
        testCases: [
            { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
            { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' }
        ],
        tags: ['Array', 'Binary Search'],
        hints: ['Check which half of the array is sorted (left or right).', 'Determine if the target lies within the sorted half.'],
        optimalSolution: "def search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        m = (l + r) // 2\n        if nums[m] == target: return m\n        if nums[l] <= nums[m]:\n            if target > nums[m] or target < nums[l]: l = m + 1\n            else: r = m - 1\n        else:\n            if target < nums[m] or target > nums[r]: r = m - 1\n            else: l = m + 1\n    return -1",
        methodName: 'search',
        template: "class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '37-1', question: 'Can we achieve O(log n) on a rotated array?', options: ['No', 'Yes, by modified binary search', 'Only if pivot is known', 'Only if N is small'], correctAnswer: 1, explanation: 'Even rotated, one half of the current range is always sorted.', category: 'algorithm' },
            { id: '37-2', question: 'How to check if the left half [l, m] is sorted?', options: ['nums[l] < nums[m]', 'nums[l] < nums[r]', 'nums[m] < nums[r]', 'None'], correctAnswer: 0, explanation: 'In a sorted array, the start must be less than or equal to the middle.', category: 'approach' }
        ]
    },
    {
        id: '38',
        title: 'Combination Sum',
        difficulty: 'Medium',
        description: `Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target.\n\nThe same number may be chosen from candidates an unlimited number of times.`,
        inputFormat: 'candidates = [2,3,6,7], target = 7',
        outputFormat: '[[2,2,3],[7]]',
        constraints: ['1 ≤ candidates.length ≤ 30', '2 ≤ candidates[i] ≤ 40', 'Distinct candidates.', '1 ≤ target ≤ 40'],
        testCases: [
            { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]' },
            { input: 'candidates = [2,3,5], target = 8', output: '[[2,2,2,2],[2,3,3],[3,5]]' }
        ],
        tags: ['Array', 'Backtracking'],
        hints: ['Use backtracking to explore combination branches.', 'Each step, you can either pick the current number again or move to the next.'],
        optimalSolution: "def combinationSum(candidates, target):\n    res = []\n    def dfs(i, cur, total):\n        if total == target:\n            res.append(cur.copy())\n            return\n        if i >= len(candidates) or total > target: return\n        cur.append(candidates[i])\n        dfs(i, cur, total + candidates[i])\n        cur.pop()\n        dfs(i + 1, cur, total)\n    dfs(0, [], 0)\n    return res",
        methodName: 'combinationSum',
        template: "class Solution:\n    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '38-1', question: 'What approach avoids duplicate combinations like [2,3] and [3,2]?', options: ['Sorting results', 'Strictly increasing index during traversal', 'Using a set', 'None'], correctAnswer: 1, explanation: 'By only considering current and future indices, we ensure a fixed order.', category: 'approach' },
            { id: '38-2', question: 'What is the base case for the recursion?', options: ['total > target', 'total == target', 'Both A and B', 'i == n'], correctAnswer: 2, explanation: 'Stop if we hit the target or overshoot it.', category: 'algorithm' }
        ]
    },
    {
        id: '39',
        title: 'Permutations',
        difficulty: 'Medium',
        description: `Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.`,
        inputFormat: 'nums = [1,2,3]',
        outputFormat: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',
        constraints: ['1 ≤ nums.length ≤ 6', '-10 ≤ nums[i] ≤ 10', 'All unique.'],
        testCases: [
            { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' },
            { input: 'nums = [0,1]', output: '[[0,1],[1,0]]' }
        ],
        tags: ['Array', 'Backtracking'],
        hints: ['Use recursion to build permutations swap-by-swap.', 'Alternatively, maintain a used set/array.'],
        optimalSolution: "def permute(nums):\n    res = []\n    if len(nums) == 1: return [nums.copy()]\n    for i in range(len(nums)):\n        n = nums.pop(0)\n        perms = permute(nums)\n        for p in perms:\n            p.append(n)\n        res.extend(perms)\n        nums.append(n)\n    return res",
        methodName: 'permute',
        template: "class Solution:\n    def permute(self, nums: List[int]) -> List[List[int]]:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '39-1', question: 'How many permutations of N distinct elements exist?', options: ['N²', '2^N', 'N!', 'log N'], correctAnswer: 2, explanation: 'The number of permutations is N factorial.', category: 'algorithm' },
            { id: '39-2', question: 'What is a common recursion state for this?', options: ['(index, current_list)', '(total_sum)', '(used_set, current_path)', 'None'], correctAnswer: 2, explanation: 'Tracking which elements are used avoids repeats.', category: 'approach' }
        ]
    },
    {
        id: '40',
        title: 'Merge Intervals',
        difficulty: 'Medium',
        description: `Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
        inputFormat: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        outputFormat: '[[1,6],[8,10],[15,18]]',
        constraints: ['1 ≤ intervals.length ≤ 10⁴', 'intervals[i].length == 2', '0 ≤ starti ≤ endi ≤ 10⁴'],
        testCases: [
            { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
            { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]' }
        ],
        tags: ['Array', 'Sorting'],
        hints: ['Sort the intervals by their start times.', 'Maintain a result list and merge current with the last merged interval if they overlap.'],
        optimalSolution: "def merge(intervals):\n    intervals.sort(key=lambda i: i[0])\n    res = [intervals[0]]\n    for start, end in intervals[1:]:\n        lastEnd = res[-1][1]\n        if start <= lastEnd:\n            res[-1][1] = max(lastEnd, end)\n        else:\n            res.append([start, end])\n    return res",
        methodName: 'merge',
        template: "class Solution:\n    def merge(self, intervals: List[List[int]]) -> List[List[int]]:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '40-1', question: 'Why sort by start time?', options: ['Makes processing linear', 'Required to see overlaps efficiently', 'Both A and B', 'Sorting is fast'], correctAnswer: 2, explanation: 'Sorting organizes intervals so overlaps can be found in one pass.', category: 'approach' },
            { id: '40-2', question: 'Complexity of the sorted approach?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correctAnswer: 1, explanation: 'Sorting dominates the runtime.', category: 'algorithm' }
        ]
    },
    {
        id: '41',
        title: 'Lowest Common Ancestor of a Binary Tree',
        difficulty: 'Medium',
        description: `Given a binary tree, find the lowest common ancestor (LCA) node of two given nodes, p and q.`,
        inputFormat: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1',
        outputFormat: '3',
        constraints: ['Nodes in tree [2, 10⁵]', '-10⁹ ≤ Node.val ≤ 10⁹', 'All values unique.', 'p != q', 'p, q exist in tree.'],
        testCases: [
            { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', output: '3' },
            { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4', output: '5' }
        ],
        tags: ['Tree', 'DFS'],
        hints: ['If both p and q are in the subtrees, current is LCA.', 'If one is current, current is LCA.'],
        optimalSolution: "def lowestCommonAncestor(root, p, q):\n    if not root or root == p or root == q: return root\n    left = lowestCommonAncestor(root.left, p, q)\n    right = lowestCommonAncestor(root.right, p, q)\n    if left and right: return root\n    return left or right",
        methodName: 'lowestCommonAncestor',
        template: "class Solution:\n    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':\n        # Write your code here\n        pass",
        mcqs: [
            { id: '41-1', question: 'What is returned if p is found in the left subtree and q is in the right?', options: ['null', 'The root node', 'p or q', 'Both'], correctAnswer: 1, explanation: 'The root is the LCA because its subtrees contain both targets.', category: 'approach' },
            { id: '41-2', question: 'Time complexity of this recursive approach?', options: ['O(H) where H is height', 'O(N)', 'O(log N)', 'O(N²)'], correctAnswer: 1, explanation: 'In the worst case, we visit every node.', category: 'algorithm' }
        ]
    },
    {
        id: '42',
        title: 'Time Based Key-Value Store',
        difficulty: 'Medium',
        description: `Design a time-based key-value data structure that can store multiple values for the same key at different time stamps and retrieve the key's value at a certain timestamp.`,
        inputFormat: '["TimeMap", "set", "get", "get", "set", "get", "get"]\n[[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]',
        outputFormat: '[null, null, "bar", "bar", null, "bar2", "bar2"]',
        constraints: ['1 ≤ key, value.length ≤ 100', '1 ≤ timestamp ≤ 10⁷', 'All timestamps in set are strictly increasing.'],
        testCases: [
            { input: '["TimeMap", "set", "get", "get", "set", "get", "get"]\n[[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]', output: '[null, null, "bar", "bar", null, "bar2", "bar2"]' }
        ],
        tags: ['Hash Table', 'String', 'Binary Search', 'Design'],
        hints: ['Use a hash map to map keys to a list of (timestamp, value).', 'Use binary search to find the largest timestamp <= target.'],
        optimalSolution: "class TimeMap:\n    def __init__(self):\n        self.store = {}\n    def set(self, key, value, timestamp):\n        if key not in self.store: self.store[key] = []\n        self.store[key].append([value, timestamp])\n    def get(self, key, timestamp):\n        res = \"\"\n        values = self.store.get(key, [])\n        l, r = 0, len(values) - 1\n        while l <= r:\n            m = (l + r) // 2\n            if values[m][1] <= timestamp:\n                res = values[m][0]\n                l = m + 1\n            else: r = m - 1\n        return res",
        methodName: '__init__',
        template: "class TimeMap:\n    def __init__(self):\n        pass\n    def set(self, key: str, value: str, timestamp: int) -> None:\n        pass\n    def get(self, key: str, timestamp: int) -> str:\n        pass",
        mcqs: [
            { id: '42-1', question: 'Which algorithm helps find the latest value at timestamp T?', options: ['Linear search', 'Binary search (find floor)', 'BFS', 'Sorting'], correctAnswer: 1, explanation: 'Since timestamps are appended in order, binary search is efficient.', category: 'algorithm' },
            { id: '42-2', question: 'What to return if no such timestamp exists?', options: ['None', 'Empty string ""', 'Error', 'Oldest value'], correctAnswer: 1, explanation: 'The problem typically expects an empty string if no valid timestamp is found.', category: 'approach' }
        ]
    },
    {
        id: '43',
        title: 'Accounts Merge',
        difficulty: 'Medium',
        description: `Given a list of accounts where each element accounts[i] is a list of strings, where the first element accounts[i][0] is a name, and the rest of the elements are emails representing emails of the account.`,
        inputFormat: 'accounts = [["John","johnsmith@mail.com","john_newyork@mail.com"],["John","johnsmith@mail.com","john00@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]',
        outputFormat: '[["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]',
        constraints: ['1 ≤ accounts.length ≤ 1000', '2 ≤ accounts[i].length ≤ 10', 'lowercase English letters for emails.'],
        testCases: [
            { input: 'accounts = [["John","johnsmith@mail.com","john_newyork@mail.com"],["John","johnsmith@mail.com","john00@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]', output: '[["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],["Mary","mary@mail.com"],["John","johnnybravo@mail.com"]]' }
        ],
        tags: ['Array', 'Hash Table', 'String', 'DFS', 'BFS', 'Union Find'],
        hints: ['Think of each account as a node in a graph, with emails as edges.', 'Use Union-Find or DFS to group all connected emails.'],
        optimalSolution: "def accountsMerge(accounts):\n    dsu = DSU(len(accounts))\n    email_to_idx = {}\n    for i, acc in enumerate(accounts):\n        for email in acc[1:]:\n            if email in email_to_idx: dsu.union(i, email_to_idx[email])\n            else: email_to_idx[email] = i\n    merged = collections.defaultdict(list)\n    for email, i in email_to_idx.items(): merged[dsu.find(i)].append(email)\n    return [[accounts[i][0]] + sorted(emails) for i, emails in merged.items()]",
        methodName: 'accountsMerge',
        template: "class Solution:\n    def accountsMerge(self, accounts: List[List[str]]) -> List[List[str]]:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '43-1', question: 'Which data structure is most efficient for merging sets?', options: ['Stack', 'Union-Find (DSU)', 'Hash Map only', 'Heap'], correctAnswer: 1, explanation: 'DSU is designed for grouping elements and merging sets.', category: 'approach' },
            { id: '43-2', question: 'What uniquely identifies a person across accounts?', options: ['The name', 'A common email address', 'The account index', 'None'], correctAnswer: 1, explanation: 'Names can be duplicate but a shared email implies it is the same person.', category: 'algorithm' }
        ]
    },
    {
        id: '44',
        title: 'Sort Colors',
        difficulty: 'Medium',
        description: `Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.\n\nWe will use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively.`,
        inputFormat: 'nums = [2,0,2,1,1,0]',
        outputFormat: '[0,0,1,1,2,2]',
        constraints: ['n == nums.length', '1 ≤ n ≤ 300', 'nums[i] is 0, 1, or 2.'],
        testCases: [
            { input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]' },
            { input: 'nums = [2,0,1]', output: '[0,1,2]' }
        ],
        tags: ['Array', 'Two Pointers', 'Sorting'],
        hints: ['This is the Dutch National Flag problem.', 'Use three pointers to track 0, 1, and 2 boundaries.'],
        optimalSolution: "def sortColors(nums):\n    l, i, r = 0, 0, len(nums) - 1\n    while i <= r:\n        if nums[i] == 0:\n            nums[l], nums[i] = nums[i], nums[l]\n            l += 1\n            i += 1\n        elif nums[i] == 2:\n            nums[i], nums[r] = nums[r], nums[i]\n            r -= 1\n        else: i += 1",
        methodName: 'sortColors',
        template: "class Solution:\n    def sortColors(self, nums: List[int]) -> None:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '44-1', question: 'What is the Dutch National Flag problem algorithm complexity?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(n log n)'], correctAnswer: 0, explanation: 'It completes the sort in a single pass.', category: 'algorithm' },
            { id: '44-2', question: 'Why not just use built-in sort()?', options: ['Built-in sort is slow', 'The problem asks for one-pass O(1) space', 'Colors are not numbers', 'Wait, you can'], correctAnswer: 1, explanation: 'The goal is to practice the efficient 3-way partition.', category: 'approach' }
        ]
    },
    {
        id: '45',
        title: 'Word Search',
        difficulty: 'Medium',
        description: `Given an m x n grid of characters board and a string word, return true if word exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.`,
        inputFormat: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        outputFormat: 'true',
        constraints: ['m == board.length', 'n == board[i].length', '1 ≤ m, n ≤ 6', '1 ≤ word.length ≤ 15'],
        testCases: [
            { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true' },
            { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"', output: 'true' }
        ],
        tags: ['Array', 'Backtracking', 'Matrix'],
        hints: ['Iterate through each cell as a starting point.', 'Use backtracking (DFS) to find the word.'],
        optimalSolution: "def exist(board, word):\n    R, C = len(board), len(board[0])\n    def dfs(r, c, k):\n        if k == len(word): return True\n        if r<0 or r>=R or c<0 or c>=C or board[r][c] != word[k]: return False\n        temp, board[r][c] = board[r][c], '#'\n        res = dfs(r+1,c,k+1) or dfs(r-1,c,k+1) or dfs(r,c+1,k+1) or dfs(r,c-1,k+1)\n        board[r][c] = temp\n        return res\n    for r in range(R):\n        for c in range(C):\n            if dfs(r, c, 0): return True\n    return False",
        methodName: 'exist',
        template: "class Solution:\n    def exist(self, board: List[List[str]], word: str) -> bool:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '45-1', question: 'How to handle "the same cell may not be used more than once"?', options: ['Use a visited set', 'Modify cell in-place then restore', 'Both A and B', 'Impossible'], correctAnswer: 2, explanation: 'Both methods prevent revisiting a cell during the same search path.', category: 'approach' },
            { id: '45-2', question: 'What is the worst-case complexity?', options: ['O(N*M * 4^L)', 'O(N+M+L)', 'O(N*M)', 'O(4^L)'], correctAnswer: 0, explanation: 'From each starting cell, we explore 4 directions up to depth L.', category: 'algorithm' }
        ]
    },
    {
        id: '46',
        title: 'Find All Anagrams in a String',
        difficulty: 'Medium',
        description: `Given two strings s and p, return an array of all the start indices of p's anagrams in s. You may return the answer in any order.`,
        inputFormat: 's = "cbaebabacd", p = "abc"',
        outputFormat: '[0,6]',
        constraints: ['1 ≤ s.length, p.length ≤ 3 * 10⁴', 'lowercase English letters.'],
        testCases: [
            { input: 's = "cbaebabacd", p = "abc"', output: '[0,6]', explanation: 'Anagrams at index 0 and 6.' },
            { input: 's = "abab", p = "ab"', output: '[0,1,2]' }
        ],
        tags: ['Hash Table', 'String', 'Sliding Window'],
        hints: ['Use a sliding window of size len(p).', 'Maintain a character count of the window and compare with p.'],
        optimalSolution: "def findAnagrams(s, p):\n    ns, np = len(s), len(p)\n    if ns < np: return []\n    pCount, sCount = collections.Counter(p), collections.Counter(s[:np])\n    res = [0] if pCount == sCount else []\n    for i in range(np, ns):\n        sCount[s[i]] += 1\n        sCount[s[i-np]] -= 1\n        if sCount[s[i-np]] == 0: del sCount[s[i-np]]\n        if pCount == sCount: res.append(i - np + 1)\n    return res",
        methodName: 'findAnagrams',
        template: "class Solution:\n    def findAnagrams(self, s: str, p: str) -> List[int]:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '46-1', question: 'How large is the sliding window?', options: ['len(s)', 'Exactly len(p)', 'Variable length', 'None'], correctAnswer: 1, explanation: 'Anagrams must have the same length as p.', category: 'approach' },
            { id: '46-2', question: 'Efficiency of using a frequency hash map?', options: ['Slow', 'O(1) comparison (fixed size 26)', 'Memory intensive', 'None'], correctAnswer: 1, explanation: 'Since there are only 26 lowercase letters, comparing maps is O(1).', category: 'algorithm' }
        ]
    },
    {
        id: '47',
        title: 'Minimum Window Substring',
        difficulty: 'Hard',
        description: `Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".`,
        inputFormat: 's = "ADOBECODEBANC", t = "ABC"',
        outputFormat: '"BANC"',
        constraints: ['m, n ≤ 10⁵', 'Lowercase and uppercase English letters.'],
        testCases: [
            { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' },
            { input: 's = "a", t = "a"', output: '"a"' }
        ],
        tags: ['Hash Table', 'String', 'Sliding Window'],
        hints: ['Use two pointers and a hash map to track counts.', 'Expand right until window is valid, then shrink left to minimize.'],
        optimalSolution: "def minWindow(s, t):\n    if not t: return \"\"\n    countT, window = collections.Counter(t), {}\n    have, need = 0, len(countT)\n    res, resLen = [-1, -1], float(\"inf\")\n    l = 0\n    for r in range(len(s)):\n        c = s[r]\n        window[c] = 1 + window.get(c, 0)\n        if c in countT and window[c] == countT[c]: have += 1\n        while have == need:\n            if (r - l + 1) < resLen:\n                res = [l, r]\n                resLen = (r - l + 1)\n            window[s[l]] -= 1\n            if s[l] in countT and window[s[l]] < countT[s[l]]: have -= 1\n            l += 1\n    l, r = res\n    return s[l:r+1] if resLen != float(\"inf\") else \"\"",
        methodName: 'minWindow',
        template: "class Solution:\n    def minWindow(self, s: str, t: str) -> str:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '47-1', question: 'What determines if a window is "valid"?', options: ['It has same length as t', 'It contains all characters in t', 'It is sorted', 'It has no duplicates'], correctAnswer: 1, explanation: 'The window must contain all character requirements from t.', category: 'approach' },
            { id: '47-2', question: 'Complexity of this two-pointer approach?', options: ['O(m*n)', 'O(m+n)', 'O(m log m)', 'O(n²)'], correctAnswer: 1, explanation: 'Each pointer visits each index at most once.', category: 'algorithm' }
        ]
    },
    {
        id: '48',
        title: 'Serialize and Deserialize Binary Tree',
        difficulty: 'Hard',
        description: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.`,
        inputFormat: 'root = [1,2,3,null,null,4,5]',
        outputFormat: '[1,2,3,null,null,4,5]',
        constraints: ['Nodes in tree [0, 10⁴]', '-1000 ≤ Node.val ≤ 1000'],
        testCases: [
            { input: 'root = [1,2,3,null,null,4,5]', output: '[1,2,3,null,null,4,5]' }
        ],
        tags: ['Tree', 'DFS', 'BFS', 'Design', 'String'],
        hints: ['Use pre-order traversal for serialization.', 'Use a queue to reconstruct the tree from the string.'],
        optimalSolution: "class Codec:\n    def serialize(self, root):\n        res = []\n        def dfs(node):\n            if not node:\n                res.append(\"N\")\n                return\n            res.append(str(node.val))\n            dfs(node.left)\n            dfs(node.right)\n        dfs(root)\n        return \",\".join(res)\n    def deserialize(self, data):\n        vals = data.split(\",\")\n        self.i = 0\n        def dfs():\n            if vals[self.i] == \"N\":\n                self.i += 1\n                return None\n            node = TreeNode(int(vals[self.i]))\n            self.i += 1\n            node.left = dfs()\n            node.right = dfs()\n            return node\n        return dfs()",
        methodName: 'serialize',
        template: "class Codec:\n    def serialize(self, root: TreeNode) -> str:\n        pass\n    def deserialize(self, data: str) -> TreeNode:\n        pass",
        mcqs: [
            { id: '48-1', question: 'Why handle null nodes (denoted by "N" or "null")?', options: ['To save space', 'To maintain the tree structure', 'Required by Python', 'None'], correctAnswer: 1, explanation: 'Without marking nulls, we cannot uniquely reconstruct the original tree structure from a single traversal list.', category: 'approach' },
            { id: '48-2', question: 'Which traversal is most common for this?', options: ['Inorder', 'Pre-order or Level-order', 'Post-order only', 'None'], correctAnswer: 1, explanation: 'Pre-order and Level-order (BFS) are standard choices.', category: 'algorithm' }
        ]
    },
    {
        id: '49',
        title: 'Trapping Rain Water',
        difficulty: 'Hard',
        description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
        inputFormat: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        outputFormat: '6',
        constraints: ['n == height.length', '1 ≤ n ≤ 2 * 10⁴', '0 ≤ height[i] ≤ 10⁵'],
        testCases: [
            { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
            { input: 'height = [4,2,0,3,2,5]', output: '9' }
        ],
        tags: ['Array', 'Two Pointers', 'Stack', 'Dynamic Programming'],
        hints: ['The water above a bar is min(max_left, max_right) - height[i].', 'Use two pointers to solve in O(1) space.'],
        optimalSolution: "def trap(height):\n    l, r = 0, len(height) - 1\n    leftMax, rightMax = height[l], height[r]\n    res = 0\n    while l < r:\n        if leftMax < rightMax:\n            l += 1\n            leftMax = max(leftMax, height[l])\n            res += leftMax - height[l]\n        else:\n            r -= 1\n            rightMax = max(rightMax, height[r])\n            res += rightMax - height[r]\n    return res",
        methodName: 'trap',
        template: "class Solution:\n    def trap(self, height: List[int]) -> int:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '49-1', question: 'How much water can a bar at index i hold?', options: ['min(L_max, R_max)', 'min(L_max, R_max) - height[i]', 'L_max + R_max', 'None'], correctAnswer: 1, explanation: 'The height of the water is determined by the shorter of the two surrounding tallest bars.', category: 'algorithm' },
            { id: '49-2', question: 'What is the space complexity of the two-pointer approach?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 0, explanation: 'Only a few variables are used Regardless of input size.', category: 'approach' }
        ]
    },
    {
        id: '50',
        title: 'Median of Two Sorted Arrays',
        difficulty: 'Hard',
        description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).`,
        inputFormat: 'nums1 = [1,3], nums2 = [2]',
        outputFormat: '2.00000',
        constraints: ['m, n ≤ 1000', '-10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶'],
        testCases: [
            { input: 'nums1 = [1,3], nums2 = [2]', output: '2.0', explanation: 'Sorted [1,2,3], median is 2.' },
            { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.5', explanation: 'Sorted [1,2,3,4], median is (2+3)/2 = 2.5.' }
        ],
        tags: ['Array', 'Binary Search', 'Divide and Conquer'],
        hints: ['Try to partition the two arrays such that left parts and right parts have equal size.', 'Use binary search on the smaller array.'],
        optimalSolution: "def findMedianSortedArrays(nums1, nums2):\n    A, B = nums1, nums2\n    total = len(nums1) + len(nums2)\n    half = total // 2\n    if len(B) < len(A): A, B = B, A\n    l, r = 0, len(A) - 1\n    while True:\n        i = (l + r) // 2\n        j = half - i - 2\n        Aleft = A[i] if i >= 0 else float(\"-inf\")\n        Aright = A[i + 1] if (i + 1) < len(A) else float(\"inf\")\n        Bleft = B[j] if j >= 0 else float(\"-inf\")\n        Bright = B[j + 1] if (j + 1) < len(B) else float(\"inf\")\n        if Aleft <= Bright and Bleft <= Aright:\n            if total % 2: return min(Aright, Bright)\n            return (max(Aleft, Bleft) + min(Aright, Bright)) / 2\n        elif Aleft > Bright: r = i - 1\n        else: l = i + 1",
        methodName: 'findMedianSortedArrays',
        template: "class Solution:\n    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:\n        # Write your code here\n        pass",
        mcqs: [
            { id: '50-1', question: 'What is the required time complexity?', options: ['O(m+n)', 'O(log(m+n))', 'O(1)', 'O(n²)'], correctAnswer: 1, explanation: 'Standard binary search approach for median of two arrays.', category: 'algorithm' },
            { id: '50-2', question: 'Why use binary search on the smaller array?', options: ['It is easier to index', 'To minimize search space for complexity', 'Either array works fine', 'None'], correctAnswer: 1, explanation: 'The search space is limited by the smaller array to ensure O(log min(m, n)).', category: 'approach' }
        ]
    }
];
