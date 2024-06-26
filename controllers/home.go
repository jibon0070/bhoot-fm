package controllers

import (
	"html/template"
	"net/http"
	"regexp"
)

type Date struct {
	Year  string
	Month string
	Day   string
}

func Home(w http.ResponseWriter, r *http.Request) {
	var param string
	if len(r.URL.Path) > len("/") {
		param = r.URL.Path[len("/"):]
	}
	isValidDate, err := regexp.MatchString(`^\d{4}-\d{2}-\d{2}$`, param)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	var date Date
	if isValidDate {
		date.Year = param[0:4]
		date.Month = param[5:7]
		date.Day = param[8:10]
	}
	t, err := template.ParseFiles("views/home.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	t.Execute(w, date)
}
