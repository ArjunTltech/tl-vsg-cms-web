import React, { useRef, useEffect, useState, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; 

const CustomQuillEditor = ({
  value,
  onChange,
  placeholder = "Write your content...",
  hasError = false,
  wordCount = 0,
  maxWordCount = 5000,
  minWordCount = 10,
}) => {
  const quillRef = useRef(null);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme(localStorage.getItem("theme") || "light");
    }
  }, []);


  useEffect(() => {
    const toolbar = document.querySelector(".ql-toolbar");
    if (!toolbar) return;

    const tooltips = {
      'button.ql-bold': 'Bold',
      'button.ql-italic': 'Italic',
      'button.ql-underline': 'Underline',
      'button.ql-strike': 'Strikethrough',
      'button.ql-list[value="ordered"]': 'Ordered List',
      'button.ql-list[value="bullet"]': 'Bullet List',
      'button.ql-indent[value="-1"]': 'Outdent',
      'button.ql-indent[value="+1"]': 'Indent',
      'button.ql-align': 'Align',
      'button.ql-blockquote': 'Blockquote',
      'button.ql-code-block': 'Code Block',
      'button.ql-link': 'Insert Link',
      'button.ql-clean': 'Remove Formatting',
      'span.ql-color': 'Text Color',
      'span.ql-background': 'Background Color',
      'span.ql-font': 'Font Family',
      'span.ql-header': 'Header',
    };

    Object.entries(tooltips).forEach(([selector, title]) => {
      try {
        const elements = toolbar.querySelectorAll(selector);
        elements.forEach((el) => {
          if (!el.getAttribute("title")) {
            el.setAttribute("title", title);
          }
        });
      } catch (error) {
        console.warn(`Invalid selector for tooltip: ${selector}`, error);
      }
    });
  }, []); 


  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }], 
    ],
    clipboard: {
      matchVisual: false,
    },
  };


  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 
    'link',
    'align', 'color', 'background', 'font',
    'blockquote', 'code-block',
  ];

  const handleChange = useCallback((content, delta, source, editor) => {

    onChange(content);
  }, [onChange]);

  const getWordCountStatus = () => {
    if (wordCount > maxWordCount) {
      return "text-error";
    } else if (wordCount < minWordCount && wordCount > 0) {
      return "text-error";
    } else if (wordCount === 0 && minWordCount > 0) { 
        return "text-error";
    } else if (wordCount > maxWordCount * 0.9) {
      return "text-warning";
    }
    return "text-success";
  };

  return (
    <div className="form-control mb-4">
      <label className="label">
        <span className="label-text">Content <span className="text-error"> *</span></span>
        <span className={`label-text-alt ${getWordCountStatus()}`}>
          {wordCount}/{maxWordCount} words
        </span>
      </label>
      <div className={`quill-container ${theme === "dark" ? "dark-mode" : "light-mode"}`}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={quillModules}
          formats={quillFormats}
          className={`custom-quill ${hasError ? 'quill-error' : ''}`}
          placeholder={placeholder}
        />
   
        <style jsx global>{`
          .quill-container {
            border-radius: 0.5rem;
            overflow: hidden;
          }
          
          .quill-container .ql-container {
            min-height: 200px;
            max-height: 500px;
            overflow-y: auto;
            font-size: 16px;
            font-family: inherit;
          }
          
          .quill-container .ql-editor {
            min-height: 200px;
            padding: 1rem;
          }
          
          .quill-container .ql-toolbar {
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
            flex-wrap: wrap;
          }
          
          /* --- START: List Styling Review --- */
          /* Quill's default classes for indenting list items */
          /* These paddings are usually sufficient for visual nesting */
          .ql-editor .ql-indent-1 { padding-left: 3em; }
          .ql-editor .ql-indent-2 { padding-left: 4.5em; }
          .ql-editor .ql-indent-3 { padding-left: 6em; }
          .ql-editor .ql-indent-4 { padding-left: 7.5em; }
          .ql-editor .ql-indent-5 { padding-left: 9em; }
          .ql-editor .ql-indent-6 { padding-left: 10.5em; }
          .ql-editor .ql-indent-7 { padding-left: 12em; }
          .ql-editor .ql-indent-8 { padding-left: 13.5em; }

          /* Default list-style-type for base lists (usually disc/decimal) */
          /* If your global CSS sets list-style-type: none; you need to re-enable it for Quill's output */
          .ql-editor ol {
              list-style-type: decimal; /* Ensure default ordered list styling */
              padding-left: 1.5em; /* Default padding for top-level lists */
          }
          .ql-editor ul {
              list-style-type: disc; /* Ensure default unordered list styling */
              padding-left: 1.5em; /* Default padding for top-level lists */
          }

          /* --- Custom Counter/Bullet Styling (if you need specific types like a, i, square, circle) --- */
          /* If you use these, make sure they are not conflicting with generic ol/ul styles */
          /* And that list-style-type: none; is applied to the specific indented levels */

          .ql-editor ol {
            counter-reset: custom-list-0;
          }
          .ql-editor ol > li {
            counter-increment: custom-list-0;
            list-style-type: none;
          }
          .ql-editor ol > li:before {
            content: counter(custom-list-0, decimal) '. ';
          }

          .ql-editor ol ol {
            counter-reset: custom-list-1;
          }
          .ql-editor ol ol > li {
            counter-increment: custom-list-1;
          }
          .ql-editor ol ol > li:before {
            content: counter(custom-list-1, lower-alpha) '. ';
          }

          .ql-editor ol ol ol {
            counter-reset: custom-list-2;
          }
          .ql-editor ol ol ol > li {
            counter-increment: custom-list-2;
          }
          .ql-editor ol ol ol > li:before {
            content: counter(custom-list-2, lower-roman) '. ';
          }
          /* Apply list-style-type: none; to prevent default markers */
          .ql-editor li.ql-indent-1,
          .ql-editor li.ql-indent-2,
          .ql-editor li.ql-indent-3,
          .ql-editor li.ql-indent-4,
          .ql-editor li.ql-indent-5,
          .ql-editor li.ql-indent-6,
          .ql-editor li.ql-indent-7,
          .ql-editor li.ql-indent-8 {
              list-style-type: none; /* Ensures custom counters/bullets show */
          }

          /* Different bullet styles for nested unordered lists */
          .ql-editor ul > li:before {
            content: '\u2022'; /* Default bullet */
            color: inherit;
            font-weight: bold;
            display: inline-block;
            width: 1em;
            margin-left: -1em;
          }
          .ql-editor .ql-indent-1.ql-list-bullet:before {
            content: '\u25E6'; /* White bullet / circle */
          }
          .ql-editor .ql-indent-2.ql-list-bullet:before {
            content: '\u25AA'; /* Black small square */
          }
          .ql-editor .ql-indent-3.ql-list-bullet:before {
            content: '\u25AB'; /* White small square */
          }
          .ql-editor .ql-indent-4.ql-list-bullet:before {
            content: '\u2043'; /* Hyphen bullet */
          }
          /* --- END: List Styling Review --- */
          
          /* Error state styling */
          .quill-error .ql-toolbar {
            border-color: #f56565;
          }
          
          .quill-error .ql-container {
            border-color: #f56565;
          }
          
          /* Light Mode Styles */
          .light-mode .ql-editor::before {
            color: gray !important;
            opacity: 0.6;
          }

          /* Dark Mode Styles */
          .dark-mode .ql-editor::before {
            color: white !important;
            opacity: 0.6;
          }
          
          .dark-mode .ql-toolbar {
            background-color: #2d3748;
            border-color: #4a5568;
          }
          
          .dark-mode .ql-container {
            background-color: #1a202c;
            border-color: #4a5568;
            color: #e2e8f0;
          }
          
          .dark-mode .ql-editor {
            color: #e2e8f0;
          }
          
          .dark-mode .ql-toolbar button {
            color: #e2e8f0;
            stroke: #e2e8f0;
          }
          
          .dark-mode .ql-toolbar button:hover {
            background-color: #4a5568;
          }
          
          .dark-mode .ql-toolbar .ql-stroke {
            stroke: #e2e8f0;
          }
          
          .dark-mode .ql-toolbar .ql-fill {
            fill: #e2e8f0;
          }
          
          .dark-mode .ql-toolbar .ql-picker {
            color: #e2e8f0;
          }
          
          .dark-mode .ql-toolbar .ql-picker-options {
            background-color: #2d3748;
            border-color: #4a5568;
          }
          
          .dark-mode .ql-toolbar .ql-picker-item {
            color: #e2e8f0;
          }
          
          .dark-mode .ql-toolbar .ql-picker-item:hover {
            background-color: #4a5568;
          }
          
          /* Improve button styling in toolbar */
          .ql-toolbar button {
            margin: 2px;
            border-radius: 3px;
          }
          
          .ql-toolbar button:hover {
            background-color: rgba(0, 123, 255, 0.1);
          }
          
          /* Highlight indent/outdent buttons for better UX */
          .ql-toolbar .ql-indent {
            background-color: rgba(0, 123, 255, 0.05);
            border: 1px solid rgba(0, 123, 255, 0.2);
            border-radius: 3px;
          }
          
          .ql-toolbar .ql-indent:hover {
            background-color: rgba(0, 123, 255, 0.15);
          }
          
          /* Better focus styling */
          .ql-editor:focus {
            outline: none;
          }
          
          .ql-container.ql-snow {
            border-bottom-left-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }
          
          /* Make sure images are responsive within the editor */
          .ql-editor img {
            max-width: 100%;
            height: auto;
          }
          
          /* Better blockquote styling */
          .ql-editor blockquote {
            border-left: 4px solid #ccc;
            margin-bottom: 5px;
            margin-top: 5px;
            padding-left: 16px;
            font-style: italic;
          }
          
          .dark-mode .ql-editor blockquote {
            border-left-color: #4a5568;
          }
      
          /* Code block styling */
          .ql-editor pre {
            background-color: #f1f1f1;
            color: #333;
            padding: 0.75rem;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            white-space: pre-wrap;
            overflow-x: auto;
          }
          
          .dark-mode .ql-editor pre {
            background-color: #2d3748;
            color: #e2e8f0;
          }
          
          /* Inline code styling */
          .ql-editor code {
            background-color: #f1f1f1;
            color: #e83e8c;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          }
          
          .dark-mode .ql-editor code {
            background-color: #4a5568;
            color: #fbb6ce;
          }
          
          /* Link styling */
          .ql-editor a {
            color: #007bff;
            text-decoration: underline;
          }
          
          .dark-mode .ql-editor a {
            color: #63b3ed;
          }
          
          /* Selection styling */
          .ql-editor ::selection {
            background-color: rgba(0, 123, 255, 0.2);
          }
          .dark-mode .ql-editor ::selection {
            background-color: rgba(99, 179, 237, 0.3);
          }
        `}</style>
      </div>
    </div>
  );
};

export default CustomQuillEditor;
