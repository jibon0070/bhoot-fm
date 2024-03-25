package controllers

import (
	"net/http"
	"regexp"
)

func Home(w http.ResponseWriter, r *http.Request) {
	var param string
	if len(r.URL.Path) > len("/") {
		param = r.URL.Path[len("/"):]
	}
	isValidDate, err := regexp.MatchString(`^\d{4}-\d{2}-\d{2}$`, param)
}
