document.addEventListener('DOMContentLoaded', function () {
    const searchBtn = document.getElementById('searchBtn');
    const searchForm = document.getElementById('searchForm');
    const resultArea = document.getElementById('resultArea');
    const resultTtl = document.getElementById('resultTtl');
    const resultList = document.getElementById('resultList');
    const pagination = document.getElementById('pagination');
    const resultNum = document.getElementById('resultNum');

    searchBtn.addEventListener('click', async function (e) {
        e.preventDefault();

        let searchText = searchForm.value.trim();
        let keywords = searchText.split(/[\s,]+/);

        resultList.innerHTML = '';

        let noDataElement = document.querySelector('.noData');
        if (noDataElement) {
            noDataElement.remove();
        }

        try {
            const response = await fetch("json/data.json");
            if (!response.ok) {
                throw new Error('JSONデータの読み込みに失敗しました。');
            }
            const data = await response.json();
            console.log(data);
            const patentData = data["data"] || [];

            let searchResult = patentData.filter(item =>
                keywords.some(keyword => 
                    item.patentNum.includes(keyword) ||
                    item.maker.includes(keyword) ||
                    item.summary.includes(keyword))
            );

            if (searchResult.length === 0) {
                resultTtl.style.display = "none";
                pagination.style.display = "none";

                let noDataDiv = document.createElement('div');
                noDataDiv.classList.add('noData');
                noDataDiv.textContent = '該当するデータがありません。';
                resultArea.appendChild(noDataDiv);
                return;
            }

            resultTtl.style.display = "flex";
            pagination.style.display = "block";
            resultNum.textContent = searchResult.length;

            for (const item of searchResult) {
                let link = document.createElement('a');
                link.href = `html/${item.patentNum.replace("/", "_")}.html`;

                let resultItem = document.createElement('div');
                resultItem.classList.add('resultItem');

                let resultTxtItems = document.createElement('div');
                resultTxtItems.classList.add('resultTxtItems');

                let thumbnail = document.createElement('div');
                thumbnail.classList.add('thumbnail');
                let imgSrc = `img/${item.patentNum.replace("/", "_")}.png`;

                if (await checkThumbExists(imgSrc)) {
                    thumbnail.innerHTML = `<img src="${imgSrc}" alt="">`;
                } else {
                    thumbnail.classList.add('no-thumb');
                }

                let resultTxt = document.createElement('div');
                resultTxt.classList.add('resultTxtItems');
                resultTxt.classList.add('resultTxt');

                let makerDiv = document.createElement('div');
                makerDiv.classList.add('maker');
                makerDiv.innerHTML = `<p>出願人</p><p class="maker">${item.maker}</p>`;

                let appDateDiv = document.createElement('div');
                appDateDiv.classList.add('appDateDiv');
                appDateDiv.innerHTML = `<p class="data-type">出願日<p><p class="date">${item.appDate}</p>`;

                let publicDateDiv = document.createElement('div');
                publicDateDiv.classList.add('publicDate');
                publicDateDiv.innerHTML = `<p class="data-type">公開日<p><p class="date">${item.appDate}</p>`

                let patentNumDiv = document.createElement('div');
                patentNumDiv.classList.add('patentNumDiv');
                patentNumDiv.innerHTML = `<p class="data-type">出願番号<p><p>${item.patentNum}</p>`

                let summaryDiv = document.createElement('div');
                summaryDiv.classList.add('summary');
                summaryDiv.innerHTML = `<p>${item.summary}</p>`

                resultTxtItems.appendChild(makerDiv);
                resultTxtItems.appendChild(appDateDiv);
                resultTxtItems.appendChild(publicDateDiv);
                resultTxtItems.appendChild(patentNumDiv);

                resultTxt.appendChild(resultTxtItems);
                resultTxt.appendChild(summaryDiv);

                link.appendChild(thumbnail);
                link.appendChild(resultTxt);

                resultItem.appendChild(link);

                resultList.appendChild(resultItem);
            }
        }
        catch (error) {
            console.error(`読み込みに失敗しました。`, error);
        }
    });

    async function checkThumbExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }
});
