module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true
  },
  // , "@vue/prettier"
  extends: ["plugin:vue/essential"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    // vue/script缩进
    /*"vue/script-indent": [
      "error", 2, {
        "baseIndent": 1,
        "switchCase": 1,
        "ignores": []
      }
    ],*/
    // vue/html缩进
    /*"vue/html-indent": [
      "error", 2, {
        "attribute": 1,
        "closeBracket": 0,
        "alignAttributesVertically": true,
        "ignores": []
      }
    ]*/
  },
  overrides: [
    {
      // 过滤.vue的缩进
      "files": ["*.vue"],
      "rules": {
        "indent": "off"
      }
    }
  ],
  parserOptions: {
    parser: "babel-eslint"
  }
};
