var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx } from "@lynx-js/react/jsx-runtime";
// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import '@testing-library/jest-dom';
import { expect, test, vi } from 'vitest';
import { render, getQueriesForElement } from '@lynx-js/react/testing-library';
import App from '../App.js';
test('App', function () {
    return __awaiter(void 0, void 0, void 0, function () {
        var cb, findByText, element;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cb = vi.fn();
                    render(_jsx(App, {
                        onRender: function () {
                            cb("__MAIN_THREAD__: ".concat(__MAIN_THREAD__));
                        }
                    }));
                    expect(cb).toBeCalledTimes(1);
                    expect(cb.mock.calls).toMatchInlineSnapshot("\n    [\n      [\n        \"__MAIN_THREAD__: false\",\n      ],\n    ]\n  ");
                    expect(elementTree.root).toMatchInlineSnapshot("\n    <page>\n      <view>\n        <view\n          class=\"Background\"\n        />\n        <view\n          class=\"App\"\n        >\n          <view\n            class=\"Banner\"\n          >\n            <view\n              class=\"Logo\"\n            >\n              <image\n                class=\"Logo--lynx\"\n                src=\"/src/assets/lynx-logo.png\"\n              />\n            </view>\n            <text\n              class=\"Title\"\n            >\n              React\n            </text>\n            <text\n              class=\"Subtitle\"\n            >\n              on Lynx\n            </text>\n          </view>\n          <view\n            class=\"Content\"\n          >\n            <image\n              class=\"Arrow\"\n              src=\"/src/assets/arrow.png\"\n            />\n            <text\n              class=\"Description\"\n            >\n              Tap the logo and have fun!\n            </text>\n            <text\n              class=\"Hint\"\n            >\n              Edit\n              <text\n                style=\"font-style:italic;color:rgba(255, 255, 255, 0.85)\"\n              >\n                 src/App.tsx \n              </text>\n              to see updates!\n            </text>\n          </view>\n          <view\n            style=\"flex:1\"\n          />\n        </view>\n      </view>\n    </page>\n  ");
                    findByText = getQueriesForElement(elementTree.root).findByText;
                    return [4 /*yield*/, findByText('Tap the logo and have fun!')];
                case 1:
                    element = _a.sent();
                    expect(element).toBeInTheDocument();
                    expect(element).toMatchInlineSnapshot("\n    <text\n      class=\"Description\"\n    >\n      Tap the logo and have fun!\n    </text>\n  ");
                    return [2 /*return*/];
            }
        });
    });
});
