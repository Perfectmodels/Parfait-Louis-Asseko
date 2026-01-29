
import fs from 'fs';
import path from 'path';

const userRequest = `
vhttps://i.ibb.co/dwG142cK/1000016051.jpg
https://i.ibb.co/B5HPV435/1000016378.jpg
https://i.ibb.co/pv6TsZkP/1000013300.jpg
https://i.ibb.co/5h5nr12w/1000014518.jpg
https://i.ibb.co/nqFDSf07/1000017788.jpg
https://i.ibb.co/95b28rP/1000049241.jpg
https://i.ibb.co/HLQpx0k4/DSC06436.jpg
https://i.ibb.co/FLMHhPvy/DSC06429-Modifier.jpg
https://i.ibb.co/fd8nGq3D/MG-0658-Modifier.jpg
https://i.ibb.co/23h1Q79x/473767669-122134739894550161-7332715431328236809-n.jpg
https://i.ibb.co/x9q4XK2/474037013-122134921658550161-7918620639070678145-n.jpg
https://i.ibb.co/9H8Kht6J/473448097-122134274234550161-7738628966806028461-n.jpg
https://i.ibb.co/0jTNbq7Y/473427470-122134274342550161-3272631468813940308-n-1.jpg
https://i.ibb.co/ZCSCTtL/480946208-616728137878198-6925216743970681454-n-1.jpg
https://i.ibb.co/bRm4N5sp/Whats-App-Image-2025-10-09-18-24-47-177f792a.jpg
https://i.ibb.co/dJDvpVPj/partner-10.jpg
https://i.ibb.co/Wv4fQb61/partner-9.jpg
https://i.ibb.co/twGj7TzK/partner-8.jpg
https://i.ibb.co/3mQkJm8q/partner-7.jpg
https://i.ibb.co/7MqLmdn/partner-6.jpg
https://i.ibb.co/DT8CvtR/partner-5.jpg
https://i.ibb.co/k2qtWNzR/partner-4.jpg
https://i.ibb.co/gMMbV9F1/partner-3.jpg
https://i.ibb.co/GQpzvz66/partner-2.jpg
https://i.ibb.co/tMg0trvj/partner-1.jpg
https://i.ibb.co/rfL9PKyj/9.jpg
https://i.ibb.co/LXjPjXct/8.jpg
https://i.ibb.co/svpkspQP/7.jpg
https://i.ibb.co/MTYps3X/6.jpg
https://i.ibb.co/JRj8YWhg/5.jpg
https://i.ibb.co/S4rDh0rS/4.jpg
https://i.ibb.co/wNkPZdRL/32.jpg
https://i.ibb.co/FfM6Pdg/31.jpg
https://i.ibb.co/kg4rgjbN/30.jpg
https://i.ibb.co/wFZm6PVH/3.jpg
https://i.ibb.co/93kZkMHP/29.jpg
https://i.ibb.co/STNmqkg/28.jpg
https://i.ibb.co/dwSCSZB8/27.jpg
https://i.ibb.co/mVnF8fKj/26.jpg
https://i.ibb.co/G4X7WxrH/25.jpg
https://i.ibb.co/C31MRcRy/24.jpg
https://i.ibb.co/kgCpd0z9/23.jpg
https://i.ibb.co/9mX3Xt60/22.jpg
https://i.ibb.co/xtqTLr2Q/21.jpg
https://i.ibb.co/6J42wF7T/20.jpg
https://i.ibb.co/cK44qpws/2.jpg
https://i.ibb.co/t6vYppk/19.jpg
https://i.ibb.co/hxGRxxSL/18.jpg
https://i.ibb.co/TDPdVRfS/17.jpg
https://i.ibb.co/5xKnhsPB/16.jpg
https://i.ibb.co/svTvMpN2/15.jpg
https://i.ibb.co/x0Yykdy/14.jpg
https://i.ibb.co/Z6p1s6fv/13.jpg
https://i.ibb.co/W4KBMskL/12.jpg
https://i.ibb.co/FqcSXn5b/11.jpg
https://i.ibb.co/679bPkfg/10.jpg
https://i.ibb.co/TVYhQSC/1.jpg
https://i.ibb.co/B2YL0pvJ/1000016229.jpg
https://i.ibb.co/hJhq9kZ5/1000014020.jpg
https://i.ibb.co/xts6ypST/1000016092.jpg
https://i.ibb.co/gbCFqRF4/1000015004.jpg
https://i.ibb.co/994pwVY4/1000016051.jpg
https://i.ibb.co/Y72gxSp0/Whats-App-Image-2025-10-09-18-24-47-177f792a.jpg
https://i.ibb.co/1G96qZ0d/1000015704.jpg
https://i.ibb.co/mrPDSMN4/IMG-5192.jpg
https://i.ibb.co/JR7xtGSy/IMG-4842.jpg
https://i.ibb.co/YBbTQwvS/68b75657-f267-4c99-b208-2bdfdab37f39.jpg
https://i.ibb.co/XfcsTmsP/A7-A48152-A775-4-D35-8-ECC-6-E5-E3060-E8-FC.jpg
https://i.ibb.co/Z6z5zJq6/E9-DEE732-82-B3-4458-9-CB3-AC3-A3191-BE06.jpg
https://i.ibb.co/dSkt0dY/IMG-0561.jpg
https://i.ibb.co/tPZ0RFfx/IMG-0560.jpg
https://i.ibb.co/vCNnZ2gg/1001707926.webp
https://i.ibb.co/xtjKY0rZ/BBA6-E4-E6-0614-4104-AD0-A-FEFFE2-FC5-F1-C.jpg
https://i.ibb.co/chz3GB27/e37d5034-c7aa-4b95-91a8-09a256e40d4f.jpg
https://i.ibb.co/7JF92ngx/IMG-1572.jpg
https://i.ibb.co/2rmKNVz/4889558d-30fb-46a4-81ed-a87df292f0fc.jpg
https://i.ibb.co/ZzNvrh3W/IMG-0529.jpg
https://i.ibb.co/8LkJVy4R/61bc02d3-c14f-4e2e-b981-745247bd4638.jpg
https://i.ibb.co/SD6xhTkz/27f81aa7-972c-4e04-8e98-6053ae636af6.jpg
https://i.ibb.co/nsdqjYCK/3b00aa28-f666-4026-978e-7364ddc27cda.jpg
https://i.ibb.co/SLSrZLy/320b5099-bbbb-42de-87bf-51badc83ebd9.jpg
https://i.ibb.co/WN1zYf6d/7824903c-60b8-4e60-b39f-a9a3017b86c4.jpg
https://i.ibb.co/JRpJDjwY/3ae8ddba-a90c-44b4-91de-fc7f2b264c82.jpg
https://i.ibb.co/NngkLY58/IMG-5670.jpg
https://i.ibb.co/5gJLnFfV/c60f43e54d25.png
https://i.ibb.co/M5QbQWrm/c7e3d2deb781.png
https://i.ibb.co/Z6JPmW6S/2dd00ec9fac5.png
https://i.ibb.co/dJQ1CttS/c1df23930f0e.png
https://i.ibb.co/HTb6S7fq/49ea1a4a2866.png
https://i.ibb.co/WpkPXczb/9927bc2027d6.png
https://i.ibb.co/V0SNtYyK/f29f3aa463b7.png
https://i.ibb.co/0RVZd5xQ/77ab4d469753.png
https://i.ibb.co/8gd0VWgQ/f80d41c4d3e1.png
https://i.ibb.co/k68PZQVT/81874668e275.png
https://i.ibb.co/pvrw9kzF/9fbec7e1484a.png
https://i.ibb.co/fVZ2DvxV/848886c458aa.png
https://i.ibb.co/pvsbN99P/ac17deb1652f.png
https://i.ibb.co/Q7sXX483/774289835148.png
https://i.ibb.co/Hfr7ttdW/4e283bf18d8a.png
https://i.ibb.co/PzcmHfBr/daa40c03e068.png
https://i.ibb.co/tpDJ51sn/cd5b6f3dfb20.png
https://i.ibb.co/g5gxWVJ/6c18881a9cbb.png
https://i.ibb.co/rRFpWYMZ/a39c699530f1.png
https://i.ibb.co/KpHqKy0j/3300fb8ae397.png
https://i.ibb.co/dw2Cshdr/3e11b25a1bc0.png
https://i.ibb.co/Lhvkv9s5/09dc5bf57c65.png
https://i.ibb.co/d4gGBXkj/b5e1ef8a3ed5.png
https://i.ibb.co/7dJqjD2Z/df80c78ac1c5.png
https://i.ibb.co/4nMYzQyC/5c38286db315.png
https://i.ibb.co/N6wXkKnL/6130eff1a1c0.png
https://i.ibb.co/xSFHpwWs/52dd49727781.png
https://i.ibb.co/spBSYBxf/28ad224bb76d.png
https://i.ibb.co/CKP7HGDk/110a8e45bd71.png
https://i.ibb.co/rKGk85pZ/b3018f199469.png
https://i.ibb.co/RTnc39K7/e8b8420b912f.png
https://i.ibb.co/pDH8TjP/d95dab1968cc.png
https://i.ibb.co/214k8mmc/4319bdda1cbc.png
https://i.ibb.co/zVM5NVHP/0cd5ebe61087.png
https://i.ibb.co/Rkj63dp1/3f62a2ef63ce.png
https://i.ibb.co/gbmt9xqT/076689d5d5c2.png
https://i.ibb.co/nNHtxdkF/1006346324.jpg
https://i.ibb.co/hJHVrWyb/1006346324.jpg
https://i.ibb.co/fV5qNdp8/b3038efb-8158-4c69-a92d-c02727867cf1-1-all-121734.jpg
https://i.ibb.co/2Yg2Qmqk/b3038efb-8158-4c69-a92d-c02727867cf1-1-all-73562.jpg
https://i.ibb.co/y7LMRYk/1006128222.jpg
https://i.ibb.co/HfgZyv5y/1006128413.jpg
https://i.ibb.co/Q3cbBRxF/1006128419.jpg
https://i.ibb.co/B5m4kfK8/1005401718.jpg
https://i.ibb.co/Y7fwZSpq/1005663576.jpg
https://i.ibb.co/276ywtCY/1005986095.jpg
https://i.ibb.co/Xrp3k7N2/AJC-0491.jpg
https://i.ibb.co/cKmvvMMk/AJC-0427.jpg
https://i.ibb.co/jZMdsNxS/AJC-0421.jpg
https://i.ibb.co/JWYDnq6c/AJC-0417.jpg
https://i.ibb.co/Ld4s20k8/MG-0680-Modifier.jpg
https://i.ibb.co/mFCKMywR/DSC06429.jpg
https://i.ibb.co/mF5HdZZG/MG-0658.png
https://i.ibb.co/WSB9k2f/IMG-3429.jpg
https://i.ibb.co/m5Js56qq/IMG-3731.jpg
https://i.ibb.co/Q7SzHjM3/IMG-4642.jpg
https://i.ibb.co/SDdJ5f2B/IMG-4643.jpg
https://i.ibb.co/Dg4yhTF2/IMG-3730.jpg
https://i.ibb.co/mV9ZQHHG/77ba4af4-5473-4a51-aab7-48ac5e2c1bae.jpg
https://i.ibb.co/60PV2nRT/IMG-3732.jpg
https://i.ibb.co/V01jvZG7/62fd6916-ccf7-41c8-93db-19245fc9ca6c.jpg
https://i.ibb.co/dwm0T5br/IMG-4450.jpg
https://i.ibb.co/qLn2nNry/1005401681.jpg
https://i.ibb.co/hR42bhq2/1005818064.jpg
https://i.ibb.co/gLHtjFJ7/1005422379.jpg
https://i.ibb.co/5xjnRXs6/1004035734.jpg
https://i.ibb.co/gZQffXtW/1005939541.jpg
https://i.ibb.co/d4njLDdr/1005894738.jpg
https://i.ibb.co/ZRnY3BHq/1L4A9706.jpg
https://i.ibb.co/d4Kb05q7/PMM-0403-Modifier.jpg
https://i.ibb.co/JW0gprmh/AJC-4392.jpg
https://i.ibb.co/pCynw9k/AJC-4388.jpg
https://i.ibb.co/5x40FcPy/1005937467.jpg
https://i.ibb.co/hvPcW3B/1005937469.jpg
https://i.ibb.co/20j7RR1W/1005937466.jpg
https://i.ibb.co/bMMtndYs/3-F2-B5217-60-F6-49-E6-B258-134949463308.jpg
https://i.ibb.co/Rk2vGvKJ/F0-BD3463-E82-D-4-DA9-8-A80-5-F447-ADB686-B.jpg
https://i.ibb.co/99RrKdQ7/2-F3-D4-DBB-A0-D0-4-F7-A-9-B23-49693-DFF9-E52.jpg
https://i.ibb.co/G4z6JB1j/CC84-F9-D1-8893-49-A8-BD69-87237-BD0-EA43.jpg
https://i.ibb.co/qMbT6kDL/482986573-631604006390611-5475849692479591284-n-jpg.jpg
https://i.ibb.co/CK776Ntp/b3038efb-8158-4c69-a92d-c02727867cf1-1-all-133132.jpg
https://i.ibb.co/QF5206bV/1005667993.jpg
https://i.ibb.co/6Jcm4TZ3/MG-0004.jpg
https://i.ibb.co/350bPhCT/MG-0001copie.jpg
https://i.ibb.co/ycY7HvF7/MG-0007copie.jpg
https://i.ibb.co/nqv1GrcQ/1005323955.jpg
https://i.ibb.co/4w8sW4ph/IMG-8059.jpg
https://i.ibb.co/nstrZBQs/1005538179.jpg
https://i.ibb.co/S4GBxxrw/1005452330.jpg
https://i.ibb.co/DDmhZG1w/1005550909.jpg
https://i.ibb.co/chjgbNjM/1005550897.jpg
https://i.ibb.co/Mxgq0RxW/1005550895.jpg
https://i.ibb.co/VcJ6WtpJ/1005550890.jpg
https://i.ibb.co/fdqt0BTC/1005639551.jpg
https://i.ibb.co/SXVYBYbt/1005639548.jpg
https://i.ibb.co/jPwGJSDN/1005639553.jpg
https://i.ibb.co/BHfpzvLM/1005639549.jpg
https://i.ibb.co/Kz03gh4F/Whats-App-Image-2025-10-09-18-24-47-177f792a.jpg
`;

const urls = userRequest.trim().split('\n').map(l => l.replace(/^v/, '').trim()).filter(l => l.startsWith('http'));
const mapping = {};

urls.forEach(url => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    mapping[filename] = url;
});

const constantsDir = 'g:/Parfait-Louis-Asseko-1/src/constants';
const files = fs.readdirSync(constantsDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
    const filePath = path.join(constantsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Regex to match any i.ibb.co URL and capture its filename
    const regex = /https:\/\/i\.ibb\.co\/[a-zA-Z0-9]+\/([^"' \s,]+)/g;

    content = content.replace(regex, (match, filename) => {
        if (mapping[filename]) {
            changed = true;
            return mapping[filename];
        }
        return match;
    });

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${file}`);
    }
});
