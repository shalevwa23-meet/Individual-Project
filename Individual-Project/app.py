from flask import Flask, render_template, request, redirect, url_for, flash
from flask import session as login_session
import pyrebase
import json
import time

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['SECRET_KEY'] = 'super-secret-key'

#Code goes below here


config = {
  "apiKey": "AIzaSyD00Ewmp5xIkqDNBGCAd5fH2R1wFP6huM8",
  "authDomain": "vaxpaint-db.firebaseapp.com",
  "databaseURL": "https://vaxpaint-db-default-rtdb.europe-west1.firebasedatabase.app",
  "projectId": "vaxpaint-db",
  "storageBucket": "vaxpaint-db.appspot.com",
  "messagingSenderId": "770629578489",
  "appId": "1:770629578489:web:984d41ee4707f71386bc28",
  "measurementId": "G-1GN79342DY"
  }

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
db = firebase.database()


@app.route('/', methods = ["GET","POST"])
def sign_in():
	if request.method == "POST":
		email = request.form['email']
		password = request.form['password']
		try:
			login_session['user'] = auth.sign_in_with_email_and_password(email,password)
			return redirect(url_for("home"))
		except Exception as e:
				return render_template("sign_in.html",a = json.loads(e.args[1])['error']['message'])

	return render_template("sign_in.html")




@app.route('/sign_up', methods = ["GET","POST"])
def sign_up():
	if request.method == "POST":
		name = request.form['name']
		email = request.form['email']
		password = request.form['password']
		user = {"name": name, "email":email, "password":password}
		try:
			login_session['user'] = auth.create_user_with_email_and_password(email,password)
			db.child("Users").child(login_session['user']['localId']).set(user)
			return redirect(url_for("home"))
		except Exception as e:
				return render_template("sign_up.html",a = json.loads(e.args[1])['error']['message'])

	return render_template("sign_up.html")


@app.route('/home', methods = ["POST","GET"])
def home():
	user_id = login_session['user']['localId']

	if request.method == "POST":
		return redirect(url_for("drawing", user_id=user_id, drawing_name = request.form['drawing_name']))
	if "Drawings" in db.get().val():
		if user_id in db.child("Drawings").get().val():
			return render_template('home.html', user_id = user_id, drawings = db.child("Drawings").child(user_id).get().val(), user = db.child("Users").child(user_id).get().val())
	return render_template('home.html', user_id = user_id, user = db.child("Users").child(user_id).get().val())

@app.route('/drawing/<user_id>/<drawing_name>', methods = ["GET","POST"])
def drawing(user_id, drawing_name):
	if request.method == "POST":
		data = request.form['data']
		height = request.form['height']
		width = request.form['width']
		db.child("Drawings").child(login_session['user']['localId']).child(drawing_name).set({"data":data,"height":height,"width":width})
		return redirect(url_for('home'))
	if "Drawings" in db.get().val():
		if user_id in db.child("Drawings").get().val():
			return render_template("drawing.html", user_id = user_id, drawing_name = drawing_name, drawings = db.child("Drawings").child(user_id).get().val())
	return render_template("drawing.html", user_id = user_id, drawing_name = drawing_name)
@app.route('/sign_out')
def sign_out():
	login_session['user'] = None
	auth.current_user = None
	return redirect(url_for('sign_in'))


@app.route('/quit')
def quit():
	time.sleep(1)
	return redirect(url_for('home'))
#Code goes above here
if __name__ == '__main__':
    app.run(debug=True)