import subprocess
import tempfile
import os
import sys
import json
import ast
import re
from typing import List, Optional, Any, Dict
from models import TestCaseInput, TestCaseResult
from abc import ABC, abstractmethod
import requests
import time
import random

class BaseExecutor(ABC):
    @staticmethod
    def normalize_value(val: Any) -> str:
        """Normalize a value for comparison by converting to JSON string and removing whitespace."""
        try:
            if isinstance(val, str):
                try:
                    val = json.loads(val.replace("'", '"'))
                except:
                    try:
                        val = ast.literal_eval(val)
                    except:
                        pass
            
            normalized = json.dumps(val, sort_keys=True, separators=(',', ':'))
            return normalized
        except:
            return str(val).strip()

    @abstractmethod
    def execute(self, code: str, test_cases: List[TestCaseInput], method_name: Optional[str] = None) -> List[TestCaseResult]:
        pass

class Judge0Executor:
    """Fallback executor using Judge0 Public API"""
    BASE_URL = "https://ce.judge0.com/submissions?base64_encoded=false&wait=true"
    
    def execute_remote(self, language: str, code: str, input_str: str = "") -> Dict:
        try:
            # Judge0 Language IDs
            # C++ (GCC 9.2.0): 54
            # Java (OpenJDK 13.0.1): 62
            # Python (3.8.1): 71
            lang_map = {
                "cpp": 54, "java": 62, "python": 71
            }
            lang_id = lang_map.get(language)
            if not lang_id:
                 return {"error": f"Language '{language}' not supported by Judge0 fallback."}
            
            payload = {
                "source_code": code,
                "language_id": lang_id,
                "stdin": input_str
            }
            
            response = requests.post(self.BASE_URL, json=payload, timeout=10)
            if response.status_code not in [200, 201]:
                return {"error": f"Judge0 API Error: {response.status_code} - {response.text}"}
                
            data = response.json()
            
            # Check status
            status = data.get("status", {})
            if status.get("id") != 3: # 3 is Accepted
                 # Compilation error or Runtime error
                 error_msg = data.get("compile_output") or data.get("stderr") or status.get("description") or "Unknown Error"
                 return {
                     "output": data.get("stdout", ""),
                     "error": error_msg
                 }
            
            return {
                "output": data.get("stdout", ""),
                "error": None
            }
        except Exception as e:
            return {"error": f"Remote Execution Failed: {str(e)}"}

class PythonExecutor(BaseExecutor):
    def generate_wrapper(self, user_code: str, test_input: str, method_name: Optional[str] = None) -> str:
        wrapper_script = f"""
import sys
import json
from typing import *
import ast
import re
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(values):
    if not values: return None
    root = TreeNode(values[0])
    queue = deque([root])
    i = 1
    while queue and i < len(values):
        node = queue.popleft()
        if i < len(values) and values[i] is not None:
            node.left = TreeNode(values[i])
            queue.append(node.left)
        i += 1
        if i < len(values) and values[i] is not None:
            node.right = TreeNode(values[i])
            queue.append(node.right)
        i += 1
    return root

{user_code}

def main():
    try:
        input_str = {repr(test_input)}
        normalized_input = input_str.replace('null', 'None').replace('true', 'True').replace('false', 'False')
        
        context = {{}}
        pairs = re.split(r",\s*(?=[a-zA-Z_]\w*\s*=)", normalized_input)
        
        for pair in pairs:
            if '=' in pair:
                parts = pair.split('=', 1)
                if len(parts) == 2:
                    name, val_str = parts
                    context[name.strip()] = ast.literal_eval(val_str.strip())
        
        if 'root' in context and isinstance(context['root'], list):
            context['root'] = build_tree(context['root'])
        
        sol = Solution()
        target_method_name = {repr(method_name)}
        if not target_method_name:
            methods = [m for m in dir(sol) if not m.startswith('__') and callable(getattr(sol, m))]
            target_method_name = methods[0] if methods else None
            
        if not target_method_name:
             print(json.dumps({{"error": "No method found"}}))
             return

        target_method = getattr(sol, target_method_name)
        result = target_method(**context)
        
        if isinstance(result, TreeNode):
            result = result.val
            
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({{"error": str(e)}}))

if __name__ == "__main__":
    main()
"""
        return wrapper_script

    def execute(self, code: str, test_cases: List[TestCaseInput], method_name: Optional[str] = None) -> List[TestCaseResult]:
        results = []
        for tc in test_cases:
            full_code = self.generate_wrapper(code, tc.input, method_name)
            
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8') as f:
                f.write(full_code)
                temp_path = f.name
            
            try:
                start_time = time.time()
                proc = subprocess.run(
                    [sys.executable, temp_path],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                duration = (time.time() - start_time) * 1000 # ms
                memory_usage = random.uniform(3000, 6000) # Mock memory in KB
                
                output_raw = proc.stdout.strip()
                error_raw = proc.stderr.strip()
                
                if proc.returncode != 0:
                    results.append(TestCaseResult(
                        input=tc.input,
                        expected_output=tc.expected_output,
                        actual_output=error_raw or "Execution Error",
                        passed=False,
                        error=error_raw,
                        runtime=duration,
                        memory=memory_usage
                    ))
                else:
                    try:
                        actual_val = json.loads(output_raw)
                        if isinstance(actual_val, dict) and "error" in actual_val:
                             results.append(TestCaseResult(
                                input=tc.input,
                                expected_output=tc.expected_output,
                                actual_output=actual_val["error"],
                                passed=False,
                                error=actual_val["error"],
                                runtime=duration,
                                memory=memory_usage
                            ))
                        else:
                            normalized_actual = self.normalize_value(actual_val)
                            normalized_expected = self.normalize_value(tc.expected_output)
                            passed = normalized_actual == normalized_expected
                            results.append(TestCaseResult(
                                input=tc.input,
                                expected_output=tc.expected_output,
                                actual_output=json.dumps(actual_val),
                                passed=passed,
                                runtime=duration,
                                memory=memory_usage
                            ))
                    except json.JSONDecodeError:
                        results.append(TestCaseResult(
                            input=tc.input,
                            expected_output=tc.expected_output,
                            actual_output=output_raw,
                            passed=False,
                            error="Invalid output format",
                            runtime=duration,
                            memory=memory_usage
                        ))
            except Exception as e:
                results.append(TestCaseResult(
                    input=tc.input,
                    expected_output=tc.expected_output,
                    actual_output="",
                    passed=False,
                    error=str(e),
                    runtime=0,
                    memory=0
                ))
            finally:
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
        return results


class CppExecutor(BaseExecutor):
    def convert_to_cpp_val(self, val_str: str) -> str:
        """Convert a value string (JSON-like) to C++ syntax."""
        val_str = val_str.strip()
        if val_str.startswith('[') and val_str.endswith(']'):
            # Convert list to curly brace init
            content = val_str[1:-1]
            # Recursively handle nested lists? For now simple replacement
            # C++ vector: {1, 2, 3}
            # List of lists: {{1,2}, {3,4}}
            return '{' + content.replace('[', '{').replace(']', '}') + '}'
        if val_str == "true": return "true"
        if val_str == "false": return "false"
        if val_str == "null": return "nullptr"
        return val_str

    def parse_input_vars(self, input_str: str) -> List[str]:
        """Parse 'nums = [1,2], target = 9' into ['{1,2}', '9']"""
        # Simple regex split by comma that isn't inside brackets
        # Logic matches PythonExecutor's splitting but we just want values
        parts = re.split(r",\s*(?=[a-zA-Z_]\w*\s*=)", input_str)
        values = []
        for p in parts:
            if '=' in p:
                val = p.split('=', 1)[1].strip()
                values.append(self.convert_to_cpp_val(val))
        return values

    def execute(self, code: str, test_cases: List[TestCaseInput], method_name: Optional[str] = None) -> List[TestCaseResult]:
        results = []
        import uuid
        
        # Standard includes and helper printer
        header = """
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>
#include <unordered_map>
#include <set>
#include <unordered_set>
#include <queue>
#include <stack>
#include <sstream>

using namespace std;

// Helper to print vector
template<typename T>
void print_res(const vector<T>& v) {
    cout << "[";
    for(size_t i=0; i<v.size(); ++i) {
        cout << v[i];
        if(i < v.size()-1) cout << ",";
    }
    cout << "]";
}
// Helper to print basic types
void print_res(int v) { cout << v; }
void print_res(double v) { cout << v; }
void print_res(bool v) { cout << (v ? "true" : "false"); }
void print_res(string v) { cout << "\\"" << v << "\\""; }
// Fallback
template<typename T> void print_res(T v) { cout << v; }

"""
        for tc in test_cases:
            try:
                args = self.parse_input_vars(tc.input)
                # Construct main
                args_str = ", ".join(args)
                main_func = f"""
int main() {{
    Solution sol;
    auto result = sol.{method_name or 'solution'}({args_str});
    print_res(result);
    return 0;
}}
"""
                full_code = header + code + main_func
                
                # Write to temp file
                filename = f"temp_{uuid.uuid4().hex}"
                cpp_file = f"{filename}.cpp"
                exe_file = f"{filename}.exe"
                
                with open(cpp_file, 'w') as f:
                    f.write(full_code)
                
                # Compile
                try:
                    compile_res = subprocess.run(
                        ["g++", cpp_file, "-o", exe_file],
                        capture_output=True, text=True
                    )
                except FileNotFoundError:
                    # Fallback to Judge0 if g++ is missing
                    print("Local g++ not found, switching to Judge0...")
                    judge0 = Judge0Executor()
                    # For Judge0, we send the content
                    p_res = judge0.execute_remote("cpp", full_code)
                    
                    actual = p_res.get("output", "").strip()
                    error = p_res.get("error")
                    
                    if error:
                         results.append(TestCaseResult(
                            input=tc.input, expected_output=tc.expected_output,
                            actual_output=actual, passed=False, error=error,
                            runtime=0, memory=0
                        ))
                    else:
                        passed = actual.replace(" ", "") == tc.expected_output.replace(" ", "")
                        results.append(TestCaseResult(
                            input=tc.input, expected_output=tc.expected_output,
                            actual_output=actual, passed=passed, error=None,
                            runtime=0, memory=0
                        ))
                    continue

                if compile_res.returncode != 0:
                    results.append(TestCaseResult(
                        input=tc.input, expected_output=tc.expected_output,
                        actual_output="", passed=False, error=f"Compilation Error:\\n{compile_res.stderr}"
                    ))
                    continue
                
                # Run
                start_time = time.time()
                run_res = subprocess.run(
                    [f"./{exe_file}"],
                    capture_output=True, text=True, timeout=5
                )
                duration = (time.time() - start_time) * 1000 # ms
                memory_usage = random.uniform(3000, 6000) # Mock memory in KB
                
                actual = run_res.stdout.strip()
                # Simple string comparison for now
                passed = actual.replace(" ", "") == tc.expected_output.replace(" ", "")
                
                results.append(TestCaseResult(
                    input=tc.input, expected_output=tc.expected_output,
                    actual_output=actual, passed=passed, error=run_res.stderr,
                    runtime=duration, memory=memory_usage
                ))
                
            except Exception as e:
                results.append(TestCaseResult(
                    input=tc.input, expected_output=tc.expected_output,
                    actual_output="", passed=False, error=str(e),
                    runtime=0, memory=0
                ))
            finally:
                if os.path.exists(cpp_file): os.remove(cpp_file)
                if os.path.exists(exe_file): os.remove(exe_file)
                
        return results

class JavaExecutor(BaseExecutor):
    def convert_to_java_val(self, val_str: str) -> str:
        val_str = val_str.strip()
        if val_str.startswith('[') and val_str.endswith(']'):
            # Convert to array init? Or List?
            # User templates usually use int[], List<Integer> etc.
            # Array init: new int[]{1, 2}
            # This is tricky without knowing types.
            # Heuristic: if contains brackets -> new int[][]{...} or new int[]{...}
            # Simplified: assume arrays for now or Arrays.asList for Lists.
            # Let's try to infer from content.
            # If [1,2] -> new int[]{1,2} works for int[] arg.
            content = val_str[1:-1]
            return f"new int[]{{{content}}}" # Assumption: int arrays
        if val_str == "true": return "true"
        if val_str == "false": return "false"
        return val_str

    def parse_input_vars(self, input_str: str) -> List[str]:
        parts = re.split(r",\s*(?=[a-zA-Z_]\w*\s*=)", input_str)
        values = []
        for p in parts:
            if '=' in p:
                val = p.split('=', 1)[1].strip()
                values.append(self.convert_to_java_val(val))
        return values

    def execute(self, code: str, test_cases: List[TestCaseInput], method_name: Optional[str] = None) -> List[TestCaseResult]:
        results = []
        import uuid
        
        for tc in test_cases:
            try:
                args = self.parse_input_vars(tc.input)
                args_str = ", ".join(args)
                
                # Java needs a class wrapper if not present, but user provides 'class Solution'
                # We wrap it in a file Solution.java? No, Main class needs to call it.
                # If we name file Main.java, can we have class Solution inside?
                # Yes if Solution is not public, or we remove 'public' from it.
                
                sanitized_code = code.replace("public class Solution", "class Solution")
                
                main_class = f"""
import java.util.*;

public class Main {{
    public static void main(String[] args) {{
        Solution sol = new Solution();
        // Printing result
        System.out.println(sol.{method_name or 'solution'}({args_str}));
    }}
}}

{sanitized_code}
"""
                filename = f"Main_{uuid.uuid4().hex}" 
                # Java filenames must match public class. We used Main.
                # Actually, duplicate classes named Main causes issues if we don't clean up.
                # Use unique directory?
                
                with tempfile.TemporaryDirectory() as temp_dir:
                    java_file = os.path.join(temp_dir, "Main.java")
                    with open(java_file, 'w') as f:
                        f.write(main_class)
                    
                    # Compile
                    try:
                        compile_res = subprocess.run(
                            ["javac", java_file],
                            capture_output=True, text=True
                        )
                    except FileNotFoundError:
                        # Fallback to Judge0
                        print("Local javac not found, switching to Judge0...")
                        judge0 = Judge0Executor()
                        p_res = judge0.execute_remote("java", main_class)
                         
                        actual = p_res.get("output", "").strip()
                        error = p_res.get("error")
                        
                        if error:
                             results.append(TestCaseResult(
                                input=tc.input, expected_output=tc.expected_output,
                                actual_output=actual, passed=False, error=error,
                                runtime=0, memory=0
                            ))
                        else:
                             # Java Piston output might differ slightly?
                            passed = actual == tc.expected_output
                            results.append(TestCaseResult(
                                input=tc.input, expected_output=tc.expected_output,
                                actual_output=actual, passed=passed, error=None,
                                runtime=0, memory=0
                            ))
                        continue

                    if compile_res.returncode != 0:
                        results.append(TestCaseResult(
                            input=tc.input, expected_output=tc.expected_output,
                            actual_output="", passed=False, error=f"Compilation Error:\\n{compile_res.stderr}"
                        ))
                        continue
                        
                    # Run
                    # -cp temp_dir Main
                    start_time = time.time()
                    run_res = subprocess.run(
                        ["java", "-cp", temp_dir, "Main"],
                        capture_output=True, text=True, timeout=5
                    )
                    duration = (time.time() - start_time) * 1000 # ms
                    memory_usage = random.uniform(3000, 6000) # Mock memory in KB
                    
                    actual = run_res.stdout.strip()
                    passed = actual == tc.expected_output
                    
                    results.append(TestCaseResult(
                        input=tc.input, expected_output=tc.expected_output,
                        actual_output=actual, passed=passed, error=run_res.stderr,
                        runtime=duration, memory=memory_usage
                    ))
                    
            except Exception as e:
                results.append(TestCaseResult(
                    input=tc.input, expected_output=tc.expected_output,
                    actual_output="", passed=False, error=str(e),
                    runtime=0, memory=0
                ))
                
        return results

