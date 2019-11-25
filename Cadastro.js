function Cadastro(login, senha) {
	this.getLogin =  function(){
		return login;
	}
	
	this.getSenha = function(){
		return senha;
	}
	
	this.setLogin = function(_login){
		login = _login;
	}
	
	this.setSenha = function(_senha){
		senha = _senha;
	}
	
}