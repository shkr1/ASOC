# Recibe como parametro una palabra, le quita caracteres 
# especiales y luego la transforma a minusculas.
def limpiar(palabra):
	import re
	if len(palabra) > 0 and palabra[-1] == "\n":
		palabra = palabra[:-1]

	palabra = ''.join([i if ord(i) < 128 else '' for i in palabra])
	palabra = re.sub(r"[\]\[\?\.&\$\!¡#\}\{\)\(\*\d+¿:\|\^\-\'\"/]", "", palabra)
	palabra = palabra.lower()

	return palabra

# Separa un documento por palabras individuales.
def separar(documento):
	delimiters = ".", ","," ", ", ", ". ", "...", ":", ";","\s", "\n"
	regexPattern = '|'.join(map(re.escape, delimiters))
	documento = re.split(regexPattern, documento)

	return documento