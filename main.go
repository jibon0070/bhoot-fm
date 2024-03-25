package main

import (
	"github.com/jibon0070/bhoot-fm/controllers"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", controllers.Home)
}
