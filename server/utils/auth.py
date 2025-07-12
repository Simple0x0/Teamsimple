
import bcrypt

def passwordhash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
def passwordcheck(password: str, passwordhash: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), passwordhash.encode('utf-8'))
