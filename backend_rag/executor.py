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
                proc = subprocess.run(
                    [sys.executable, temp_path],
                    capture_output=True,
                    text=True,
                    timeout=10
                )
                
                output_raw = proc.stdout.strip()
                error_raw = proc.stderr.strip()
                
                if proc.returncode != 0:
                    results.append(TestCaseResult(
                        input=tc.input,
                        expected_output=tc.expected_output,
                        actual_output=error_raw or "Execution Error",
                        passed=False,
                        error=error_raw
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
                                error=actual_val["error"]
                            ))
                        else:
                            normalized_actual = self.normalize_value(actual_val)
                            normalized_expected = self.normalize_value(tc.expected_output)
                            passed = normalized_actual == normalized_expected
                            results.append(TestCaseResult(
                                input=tc.input,
                                expected_output=tc.expected_output,
                                actual_output=json.dumps(actual_val),
                                passed=passed
                            ))
                    except json.JSONDecodeError:
                        results.append(TestCaseResult(
                            input=tc.input,
                            expected_output=tc.expected_output,
                            actual_output=output_raw,
                            passed=False,
                            error="Invalid output format"
                        ))
            except Exception as e:
                results.append(TestCaseResult(
                    input=tc.input,
                    expected_output=tc.expected_output,
                    actual_output="",
                    passed=False,
                    error=str(e)
                ))
            finally:
                if os.path.exists(temp_path):
                    os.unlink(temp_path)
        return results

class CppExecutor(BaseExecutor):
    def execute(self, code: str, test_cases: List[TestCaseInput], method_name: Optional[str] = None) -> List[TestCaseResult]:
        # Implementation for C++ would involve a more complex wrapper for parsing
        # For simplicity in this demo, we'll return a mock or a simplified version
        # Actually, let's try a basic one
        results = []
        for tc in test_cases:
            results.append(TestCaseResult(
                input=tc.input,
                expected_output=tc.expected_output,
                actual_output="C++ execution not fully implemented in this demo",
                passed=False,
                error="Multi-language backend support in progress"
            ))
        return results

class JavaExecutor(BaseExecutor):
    def execute(self, code: str, test_cases: List[TestCaseInput], method_name: Optional[str] = None) -> List[TestCaseResult]:
        results = []
        for tc in test_cases:
            results.append(TestCaseResult(
                input=tc.input,
                expected_output=tc.expected_output,
                actual_output="Java execution not fully implemented in this demo",
                passed=False,
                error="Multi-language backend support in progress"
            ))
        return results
