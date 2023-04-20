import fs = require('fs');
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	//Works as a init if needed

	let disposable = vscode.commands.registerCommand('translatron.addNewTranslationField', async () => {
		if(vscode.workspace.workspaceFolders !== undefined) {
			let workspaceFileSystemPath = vscode.workspace.workspaceFolders[0].uri.fsPath; 
		
			const filePath = workspaceFileSystemPath + "/lang/hu.json";

			const fileExists = await new Promise((resolve) => {
				fs.access(filePath, fs.constants.F_OK, (err) => {
				  resolve(!err);
				});
			});

			if(fileExists){
				let newTranslationKey = await vscode.window.showInputBox({
					placeHolder: "Nyelvi elem fordító kulcsa:",
					prompt: "Kérlek add meg a fordító kulcsot az adott nyelvi elemhez!",
					value: ""
				});
		  
		  		if(newTranslationKey === ''){
					vscode.window.showErrorMessage('A nyelvi elemhez tartozó fordító kulcs megadása kötelező!');
		  		}

				const newTranslationValue = await vscode.window.showInputBox({
					placeHolder: "Nyelvi elem fordítási értéke:",
					prompt: "Kérlek add meg az adott nyelvi elem fordítási értékét!",
					value: ""
				});
		  
		  		if(newTranslationValue === ''){
					vscode.window.showErrorMessage('A nyelvi elemhez tartozó fordítási érték megadása kötelező!');
		  		}

				const document = await vscode.workspace.openTextDocument(filePath);
				const content = document.getText();
				try {
					let contentJSON = [];
					contentJSON = JSON.parse(content);
					if(contentJSON[newTranslationKey!.toString()]){
						vscode.window.showErrorMessage('A kívánt kulcs már foglalt!');
					}else{
						   contentJSON[newTranslationKey!.toString()] = newTranslationValue;
						fs.writeFile(filePath, JSON.stringify(contentJSON), 'utf8', () => {  
							vscode.window.showInformationMessage('Nyelvi lokalizáció sikeresen frissítve!');
							vscode.window.showInformationMessage('A forditótábla szöveg értéke vágólapra másolva!');
							vscode.env.clipboard.writeText('Translatron.of(context)!.translate("'+newTranslationKey+'")');
						});
					}
				} catch (e) {
					vscode.window.showErrorMessage('A nyelvi fájl formátuma nem megfelelő JSON formátumú!');
				}
			}else{
				vscode.window.showErrorMessage('Az alap nyelvi fájl nem található, ellenőrizd, hogy létezik-e a *projectRoot/lang/hu.json* fájl!');
			}	
		}else {
			vscode.window.showErrorMessage('A bővítmény használatához nyiss meg egy projektet!');
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}