import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
    background: #c0c0c0;
    color: #000000;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  html {
    font-size: 16px;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  /* 클래식 윈도우 스타일 스크롤바 */
  ::-webkit-scrollbar {
    width: 16px;
  }

  ::-webkit-scrollbar-track {
    background: #c0c0c0;
    border: 1px solid #808080;
  }

  ::-webkit-scrollbar-thumb {
    background: #c0c0c0;
    border: 1px solid #808080;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a0a0a0;
  }

  /* 픽셀 아트 스타일 폰트 */
  @font-face {
    font-family: 'PixelFont';
    src: url('data:font/woff2;base64,d09GMgABAAAAAA...') format('woff2');
    font-weight: normal;
    font-style: normal;
  }
`;
