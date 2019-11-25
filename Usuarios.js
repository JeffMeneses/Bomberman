function Usuarios() {
	var usuarios_cadastrados = []; //vetor para guardar usuario cadastrados
	
	function validarLogin(login, senha)
	{
		if(login == undefined || senha ==  undefined)
			return false;
		
		if(nome != "" && senha != "")
			return true;
		
		return false;
	}
	
	this.inserir = function(login, senha)
	{
		if(validarLogin(login, senha))
		{
			logins.push(new Login(login, senha));
			return true;
		}
	}
	
	this.toString =  function()
	{
		var text =  ""
		for(var i = 0; i < logins.length; i++)
			text += logins[i].toString() + "\n";
		return text;
	}
	
}
