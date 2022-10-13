export class Methods {


    blockCharactersOtherThanANumber(identifiant: string ) {
        var inputBox = document.getElementById(identifiant);
        var invalidChars = [
            "-",
            "+",
            "e",
        ];
        
        if(inputBox != null) {
            
            inputBox.addEventListener("keydown", function(e) {
                if (invalidChars.includes(e.key)) {
                    e.preventDefault();
                }
            });
        }
    }

    static transformUpperCaseToTitleCase(value:string): string {
            let first = value.slice(0,1).toUpperCase();
            return first + value.slice(1).toLowerCase(); 
    }
}