# 快案 03 女秘书立绘生成记录

工具：内置 `image_gen.imagegen`，生成和背景提取均设 `transparent_background: true`。选用第二次输出，原始三态母表保存在同目录 `quick3-secretary-sheet.png`。

运行时资源：`assets/generated/quick-detective/caller-secretary-{neutral,guarded,pause}-pixel.png`。每态另有 `_256.png` 母版。只对生成结果做分栏裁切、按 alpha 轮廓水平居中和最近邻缩放；不重画像素，不用程序替代生成。母版 256×512，发运版 1024×2048，保持共同垂直基线、透明通道和透明四角。

## 初始 Prompt

Use case: illustration-story. Create a production sprite sheet for a Chinese pixel-art visual novel set in an anonymous late-night phone-in livestream. ONE landscape transparent sheet, exact 3:2 aspect, three equal vertical columns; each column fits a complete 1:2 full-body sprite with generous transparent gutters. Three poses of the SAME fictional Chinese woman, age 32, office secretary, short dark-brown bob tucked behind one ear, understated ivory blouse, charcoal tailored ankle trousers, muted burgundy cardigan, low flat shoes, holding a plain phone. Warm readable three-quarter side face turned LEFT toward the host, simplified eyes, no individual identifying detail. LEFT COLUMN neutral: phone at right ear, left arm relaxed. MIDDLE COLUMN guarded: same phone at ear, shoulders tightened, left arm drawn across waist. RIGHT COLUMN pause: phone slightly lowered near chest, gaze down, relaxed shoulders. Identical face, clothing, height, body proportions and foot baseline across all three. Authored 2D pixel art, crisp hand-placed pixel clusters at a native per-character resolution of 256x512, 24-32 restrained main colors, dark teal shadows, gentle coral edge light, natural warm facial light. Clear silhouette, no large facial shadows, no eye mask, no visor, no glow strip, no tattoo, no text, no labels, no divider, no backdrop, no vignette, no grounding shadow. True transparent alpha outside all three figures. Do not paint a checkerboard. Do not crop the head or shoes.

## 背景提取 Prompt

Background extraction only. Preserve all three complete pixel-art women exactly: identical positions, clothing, phones, shoes, poses, faces and pixel edges. Remove the entire dark brown/black backdrop, all glow, all vignette and all floor shadows, including gaps between arms and body. Output actual transparent alpha outside the three figures. No checkerboard paint, no black, no colored backdrop. Do not change or redraw the figures. Keep landscape 3:2 sprite-sheet composition and generous transparent margins. The resulting image is a game sprite atlas that must composite cleanly over any background.
