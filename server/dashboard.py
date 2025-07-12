"""
def login(username, password):
    username = sanitize_username(request.form['username'])
    password = sanitize_password(request.form['password'])
    if not username or not password:
        flash("Nom d'utilisateur ou mot de passe invalide.", "error")
        return render_template('login.html')

    user = get_user(username)
    if user and passwordcheck(password, user[2]):
        session['user'] = username
        session['u'] = random.randint(100000, 999999)
        return redirect(url_for('dashboard'))
    else:
        flash("Nom d'utilisateur ou mot de passe incorrect.", "error")
        return render_template('login.html')


"""