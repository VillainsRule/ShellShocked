import cheatManager from 'modules/cheats.js';
import variables from 'utils/variables.js';

export default () => {
    let stylesheet = `
        .ssd_container {
            position: fixed;
            top: 15px;
            right: 15px;
            width: 350px;
            height: auto;
            border: 3px solid #1f1f1f;
            background-color: #2f2f2ff2;
            z-index: 99999;
            padding: 10px;
            text-align: center;
            border-radius: 10px;
            color: #ffffff;
            font-family: 'Nunito';
        }

        .ssd_title {
            font-family: 'Sigmar One';
            font-size: 23px;
        }

        .ssd_info {
            font-weight: bold;
            font-size: 15px;
        }    

        .ssd_divider {
            width: calc(90%);
            margin: 15px 5%;
        }

        .ssd_cheatGrid {
            display: grid;
            grid-gap: 3vh 1vw;
            grid-template-columns: minmax(100px, 2fr) minmax(150px, 2fr);
            justify-items: center;
            margin: 10px 0;
            width: 100%;
        }

        .ssd_category {
            font-size: 2.5vh;
            font-weight: 1000;
            margin: 5px;
            cursor: pointer;
        }

        .ssd_cheatName {
            display: flex;
            align-items: center;
            font-size: 2.2vh;
            font-weight: 1000;
        }

        .ssd_buttons {
            display: flex;
            justify-content: center;
            gap: 5vw;
        }

        .ssd_button {
            border: 1.5px solid #1f1f1f;
            box-shadow: 5px 5px 10px #1f1f1f;
            border-radius: 5px;
            padding: 6px 20px;
            font-weight: 1000;
            font-size: 2.25vh;
            cursor: pointer;
        }

        .ssd_select {
            border: 1.5px solid #1f1f1f;
            border-radius: 5px;
            padding: 4px 15px;
            font-weight: 1000;
            font-size: 2vh;
            cursor: pointer;
            background: #1f1f1fcf;
            color: white;
            font-family: 'Nunito';
            outline: none;
        }

        .ssd_check {
            width: 40px; 
            height: 20px;
            border: 1.5px solid #1f1f1f;
            cursor: pointer;
        }
    `;
    
    document.body.insertAdjacentHTML('beforeend', `
        <style>${stylesheet}</style>
        <div class="ssd_container">
            <div class="ssd_title">ShellShocked</div>
            <div class="ssd_info">press h to open/close this.</div>
            <hr class="ssd_divider" />
            <div class="ssd_categoryList">${
                Object.entries(cheatManager.cheats).map(([ categoryName, cheatList ]) => {
                    return `
                        <div class="ssd_category" id="ssd_${categoryName}">${categoryName}</div>
                        <div class="ssd_cheatGrid" id="ssd_list_${categoryName}" style="display: none;">${
                            cheatList.map((cheat) => {
                                return `
                                    <div class="ssd_cheatName">${cheat.name}</div>
                                    ${cheat.type === 'check' ? `
                                        <input type="checkbox" ${(cheatManager.enabled(cheat.name)) ? 'checked' : ''} id="ssd_cheatCheck_${cheat.id}" class="ssd_check" />
                                    ` : cheat.type === 'menu' ? `
                                        <select class="ssd_select" id="ssd_select_${cheat.id}">
                                            ${cheatManager.options(cheat.name).map((option) => {
                                                return `<option ${cheatManager.enabled(cheat.name) === option ? 'selected' : ''} value="${option.replaceAll(' ', '_')}">${option}</option>`
                                            }).join('')}
                                        </select>
                                    ` : cheat.type === 'button' ? `
                                        <div class="ssd_button" id="ssd_button_${cheat.id}">${cheat.label}</div>
                                    ` : ''}
                                `;
                            }).join('')
                        }</div>
                    `
                }).join('')
            }</div>
            <hr class="ssd_divider" />
            <div class="ssd_buttons">
                <div class="ssd_button" onclick="window['${variables.cheatManager}'].reset();">Reset Cheats</div>
            </div>
        </div>
    `);

    Object.entries(cheatManager.cheats).map(([ categoryName, cheatList ]) => {
        let categoryCheats = document.querySelector(`#ssd_list_${categoryName}`);

        document.querySelector(`#ssd_${categoryName}`).onclick = () => categoryCheats.style.display === '' ?
            categoryCheats.style.display = 'none' :
            categoryCheats.style.display = '';

        cheatList.forEach((cheat) => {
            if (cheat.type === 'check')
                document.getElementById(`ssd_cheatCheck_${cheat.id}`).onchange = () => cheatManager.tick(cheat.name);
            else if (cheat.type === 'menu')
                document.getElementById(`ssd_select_${cheat.id}`).onchange = () =>
                    cheatManager.select(cheat.name, document.querySelector(`#ssd_select_${cheat.id}`).value.replaceAll('_', ' '));
            else if (cheat.type === 'button')
                document.getElementById(`ssd_button_${cheat.id}`).onclick = () => cheatManager.activate(cheat.name);
        })
    });
};