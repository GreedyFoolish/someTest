<template>
    <div class="edit-container">
        <div class="left-container">
            <Editor id="myEditor" :init="editorInit" v-model="editContent"></Editor>
        </div>
        <div class="right-container">
            <div style="height: 60vh !important; margin-bottom: 10px; overflow-y: auto">
                <table class="mistake-table">
                    <thead>
                        <tr>
                            <!-- <th>类型</th> -->
                            <th style="width: 40%">疑似错误</th>
                            <th style="width: 40%">修复建议</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in checkResult" :key="index"
                            :class="{ active: index == selectedIndex }">
                            <!-- <th>{{ item.errtype  }}</th> -->
                            <td class="select-wrap" @click="toTargetRowText(item, index)">
                                {{ item.errword }}
                                <div v-show="toolShowPrevNext(!item.fixFinishFlag, index)" class="select-tool-wrap">
                                    <i class="el-icon-caret-top previou-btn" @click.stop="toTargetIndexDom(-1, item)"
                                        :title="selectedTitle"></i>
                                    <i class="el-icon-caret-bottom next-btn" @click.stop="toTargetIndexDom(1, item)"
                                        :title="selectedTitle"></i>
                                </div>
                            </td>
                            <td class="select-wrap" @click="toTargetRowText(item, index)">
                                {{ item.corword?.[0] }}
                                <div v-show="toolShowPrevNext(item.fixFinishFlag, index)" class="select-tool-wrap">
                                    <i class="el-icon-caret-top previou-btn" @click.stop="toTargetIndexDom(-1, item)"
                                        :title="selectedTitle"></i>
                                    <i class="el-icon-caret-bottom next-btn" @click.stop="toTargetIndexDom(1, item)"
                                        :title="selectedTitle"></i>
                                </div>
                            </td>
                            <td class="operate-wrap" @click="fixTargetRowText(item, index)">
                                <span v-show="!item.fixFinishFlag" style="color: red">
                                    {{ item.fixPromptText }}
                                </span>
                                <span v-show="item.fixFinishFlag" style="color: green" title="点击进行撤销">
                                    {{ item.fixFinishText }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <el-button @click="fixAllRowText" type="primary">一键全部修复</el-button>
        </div>
    </div>
</template>

<script>
import api from "@/api/index.js";
import Editor from "@tinymce/tinymce-vue";
import tinymce from "tinymce";
// 导入 TinyMCE 语言包
import "tinymce-i18n/langs/zh_CN.js";
// 导入 TinyMCE 主题和皮肤
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/ui/oxide/content.min.css";
import "tinymce/skins/content/default/content.css";
// 引入所需插件
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/charmap";
import "tinymce/plugins/preview";
import "tinymce/plugins/anchor";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/help";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/print";
import "tinymce/plugins/paste";

import { UUIDGenerator, DebounceController } from "@/utils/index.js";

export default {
    name: "TinymceEdit",
    components: {
        Editor,
    },
    props: {},
    data() {
        return {
            debounceIns: new DebounceController(),
            myEditor: null,
            editorInit: {
                selector: "#myEditor",
                language: "zh_CN",
                height: 700,
                plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "help",
                    "wordcount",
                ].join(" "),
                toolbar: [
                    "undo",
                    "redo",
                    "|",
                    "formatselect",
                    "|",
                    "bold",
                    "italic",
                    "backcolor",
                    "|",
                    "alignleft",
                    "aligncenter",
                    "alignright",
                    "alignjustify",
                    "|",
                    "bullist",
                    "numlist",
                    "outdent",
                    "indent",
                    "|",
                    "removeformat",
                    "|",
                    "help",
                ].join(" "),
                // 添加内容样式，设置默认字体大小
                content_style: `
                    body { 
                        font-size: 20px !important; 
                        font-family: Arial, sans-serif;
                    }
                `,
            },
            editContent: "",
            checkResult: [],
            selectedIndex: 0,
            selectedDomLen: 0,
            curTextIDomClass: "",
            curTextIDomIndex: 0,
            sensitiveList: [],
        };
    },
    computed: {
        checkDomLen() {
            return this.selectedDomLen > 1;
        },
        toolShowPrevNext() {
            return (showFlag, index) => {
                return showFlag && index == this.selectedIndex && this.checkDomLen;
            };
        },
        selectedTitle() {
            return `总共${this.selectedDomLen}条，当前第${this.curTextIDomIndex + 1}条`;
        }
    },
    mounted() {
        this.myEditor = tinymce.get("myEditor");
        this.getData();
    },
    methods: {
        // 获取文本内容
        getData() {
            try {
                api.get("/api/getHtmlString").then((response) => {
                    if (response.code == 200) {
                        this.editContent = response.data.htmlString;
                        // console.log("文本内容:", this.editContent);
                        this.getSensitive();
                        this.checkData();
                    }
                });
            } catch (error) {
                console.error("获取文本内容失败:", error);
            }
        },
        // 获取敏感词
        getSensitive() {
            api.get("/api/getSensitive").then((response) => {
                console.log("敏感词列表:", response);
                if (response.code == 200 && response.data?.length > 0) {
                    this.sensitiveList = response.data
                    this.initSensitive()
                }
            })
        },
        // 初始化敏感词
        initSensitive() {
            console.log(this.sensitiveList)
            let tempContent = this.editContent
            this.sensitiveList.forEach((item) => {
                const regString = item
                const sensitiveTextTemplate = `<span class="sensitiveText" style="color:red;">${item}</span>` ?? ''
                tempContent = tempContent.replace(new RegExp(regString, 'g'), sensitiveTextTemplate)
            })
            this.editContent = tempContent
        },
        // 检查文本
        checkData() {
            const data = { htmlString: this.editContent };
            api.post("/api/checkText", data).then((response) => {
                console.log("检查文本结果:", response);
                let processedData = response.data.map((item) => {
                    const fixEnableFlag = item.errtype == 1;
                    return {
                        ...item,
                        fixEnableFlag,
                        fixPromptText: fixEnableFlag ? "一键修复" : "请您自行调整",
                        fixFinishFlag: false,
                        fixFinishText: "已修复",
                    };
                });

                if (processedData?.length > 0) {
                    const uniqueData = [];
                    const seenErrwords = new Set();

                    processedData.forEach((item) => {
                        if (!seenErrwords.has(item.errword)) {
                            seenErrwords.add(item.errword);
                            uniqueData.push(item);
                        }
                    });
                    this.checkResult = uniqueData;
                    this.toTargetRowText(this.checkResult?.[0], 0);
                }
            });
        },
        // 取消高亮
        clearHighlight() {
            // 匹配类名包含 activeHighlight 元素的正则表达式
            const regExp =
                /<span[^>]*class\s*=\s*["'][^"']*activeHighlight[^"']*["'][^>]*>((?:[^<]|<(?!\/span>))*?)<\/span>/gi;
            this.editContent = this.editContent?.replace(regExp, "$1");
        },
        /**
         * 滚动到选中文本元素
         * @param curTextIDomClass 当前选择文本类名
         * @param curTextIDomIndex 当前高亮文本下标
         * @param adjustFlag 是否调整下标标志
         * @param adjustType 下标调整类型
         */
        scrollTargetDom(
            curTextIDomClass = this.curTextIDomClass || "",
            curTextIDomIndex = this.curTextIDomIndex || 0,
            adjustFlag = false,
            adjustType = 1
        ) {
            const interval = setInterval(() => {
                try {
                    // 获取 iframe 的 document 元素
                    const iframeDom = this.myEditor.getWin().document;
                    const targetDomList = iframeDom.getElementsByClassName(curTextIDomClass);
                    let targetElement = targetDomList?.[curTextIDomIndex] || null;
                    if (targetDomList?.length > 0) {
                        const domLen = targetDomList?.length || 1;
                        this.selectedDomLen = domLen;
                        let activeIndex = curTextIDomIndex;
                        if (adjustFlag) {
                            activeIndex = (curTextIDomIndex + adjustType + domLen) % domLen;
                            this.curTextIDomIndex = activeIndex;
                            targetElement = targetDomList?.[activeIndex];
                        }
                        Array.from(targetDomList).forEach((item, index) => {
                            if (index == activeIndex) {
                                item.style.setProperty("border", "2px solid red", "important");
                                item.style.setProperty(
                                    "background-color",
                                    "orange",
                                    "important"
                                );
                            } else {
                                item.style.setProperty(
                                    "border",
                                    "2px solid orange",
                                    "important"
                                );
                                item.style.setProperty(
                                    "background-color",
                                    "yellow",
                                    "important"
                                );
                            }
                            // item.offsetHeight;
                        });

                        if (targetElement) {
                            clearInterval(interval);
                            // 滚动到目标元素
                            targetElement.scrollIntoView({
                                behavior: "smooth",
                                block: "center",
                                inline: "nearest",
                            });
                        }
                    }
                } catch (e) {
                    console.warn("访问iframe内容时出错:", e);
                }
            }, 100);

            // 超时清理
            setTimeout(() => {
                clearInterval(interval);
            }, 2000);
        },
        // 跳转目标行的文本
        toTargetRowText(item, index) {
            if (this.debounceIns.shouldPrevent()) {
                return;
            }
            if (!item) {
                return;
            }
            this.clearHighlight();
            let targetWord = item.errword || "";
            if (item.fixFinishFlag) {
                targetWord = item.corword?.length > 0 ? item.corword[0] : targetWord;
            }
            // 对目标词进行HTML转义以防止XSS攻击
            const escapedTargetWord = targetWord
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#x27;");
            // 使用更可靠的唯一ID生成方式
            const curTextIDomClass = `activeHighlight activeHighlight-${UUIDGenerator.short()}`;
            this.curTextIDomClass = curTextIDomClass;
            const tempMarkerTemplate = `<span class="${curTextIDomClass}">${escapedTargetWord}</span>`;

            // 安全地转义正则表达式特殊字符
            const escapeRegExp = (string) => {
                return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            };

            this.editContent = this.editContent?.replace(
                new RegExp(`(${escapeRegExp(targetWord)})`, "g"),
                tempMarkerTemplate
            );
            this.selectedIndex = index;
            this.selectedDomLen = 0;
            this.scrollTargetDom(curTextIDomClass, 0);
        },
        // 跳转到指定索引的文本元素
        toTargetIndexDom(adjustType) {
            if (this.debounceIns.shouldPrevent()) {
                return;
            }
            this.selectedDomLen = 0;
            this.scrollTargetDom(this.curTextIDomClass, this.curTextIDomIndex, true, adjustType);
        },
        // 修复目标行的文本
        fixTargetRowText(item, index) {
            if (this.debounceIns.shouldPrevent()) {
                return;
            }
            this.clearHighlight();
            if (item.fixEnableFlag) {
                const corword = item.corword?.[0] ?? "";
                const heightLightTemplate = `<span class="hghlight" style="background-color:yellow;">${corword}</span>`;
                if (item.fixFinishFlag) {
                    const regString = heightLightTemplate;
                    // const regString = corword;
                    const targetStr = item.errword;
                    this.checkResult[index].fixFinishFlag = false;
                    this.editContent = this.editContent?.replace(
                        new RegExp(regString, "g"),
                        targetStr
                    );
                    this.$message.info({ message: "已撤销修复" });
                } else {
                    const regString = item.errword;
                    const targetStr = heightLightTemplate;
                    // const targetStr = corword;
                    this.checkResult[index].fixFinishFlag = true;
                    this.editContent = this.editContent?.replace(
                        new RegExp(regString, "g"),
                        targetStr
                    );
                    this.$message.success({ message: "已修复" });
                }
            }
            this.toTargetRowText(item, index);
        },
        // 修复所有行的文本
        fixAllRowText() {
            let tempContent = this.editContent;
            this.checkResult.forEach((item, index) => {
                if (item.fixEnableFlag && !item.fixFinishFlag) {
                    const regString = item.errword;
                    const corword = item.corword?.[0] ?? "";
                    const heightLightTemplate = `<span class="hghlight" style="background-color:yellow;">${corword}</span>`;
                    this.checkResult[index].fixFinishFlag = true;
                    tempContent = tempContent?.replace(
                        new RegExp(regString, "g"),
                        heightLightTemplate
                    );
                }
            });
            this.editContent = tempContent;
            this.$message.success({ message: "已全部修复" });
            this.$nextTick(() => {
                let curIndex = this.checkResult?.findIndex((item) => item.fixEnableFlag) || 0;
                if (this.checkResult?.[curIndex]) {
                    this.toTargetRowText(this.checkResult?.[curIndex], curIndex);
                }
            });
        },
    },
};
</script>

<style scoped>
.edit-container {
    display: flex;

    .left-container {
        flex: 1;
        padding: 10px;
    }

    .right-container {
        flex: 1;
        padding: 10px;
        border-left: 1px solid #ccc;

        .mistake-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 18px;

            thead th {
                position: sticky;
                top: -1px;
                background-color: white;
                z-index: 1;
            }

            th,
            td {
                border: 1px solid #ccc;
                padding: 6px 10px;
                text-align: left;
            }

            th {
                background-color: #f5f5f5;
                font-weight: bold;
            }

            tbody {
                tr {
                    cursor: pointer;

                    &.active {
                        background-color: rgba(255, 255, 0, 0.5) !important;
                    }

                    &:nth-child(even) {
                        background-color: #fafafa;
                    }

                    &:hover {
                        background-color: rgba(255, 255, 0, 0.2);
                    }
                }

                td {
                    &.select-wrap {
                        position: relative;
                        padding-right: 15px;

                        .select-tool-wrap {
                            position: absolute;
                            top: 50%;
                            right: 5px;

                            .previou-btn {
                                position: absolute;
                                top: -20px;
                                right: 5px;
                            }

                            .next-btn {
                                position: absolute;
                                top: 0px;
                                right: 5px;
                            }
                        }
                    }
                }
            }

            td.operate-wrap {
                text-align: center;
                color: #e40001;
                cursor: pointer;
            }
        }
    }
}
</style>
