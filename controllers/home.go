package controllers

import (
	"net/http"
)

func Home(w http.ResponseWriter, r *http.Request) {
	var param string
	if len(r.URL.Path) > len("/") {
		param = r.URL.Path[len("/"):]
	}
}
