package main

import (
    "fmt"
    "log"
    "net/http"
    "os"
    "os/exec"
    "path"
    "strings"

    "gopkg.in/src-d/go-git.v4"
    "gopkg.in/src-d/go-git.v4/plumbing/transport/ssh"
)

func runGit(dir, repo, rev string) error {
    _, err := git.PlainOpen(dir)
    if err != nil {
        err = clone(dir, repo)
        if err != nil {
            return err
        }
    }

    err = checkout(dir, rev)
    if err != nil {
        return err
    }

    return nil
}

func clone(dir, repo string) error {
    err := os.Mkdir(dir, 0755)
    // if the error was something other than the directory existing, exit
    if err != nil {
        if !os.IsExist(err) {
            return fmt.Errorf("couldn't make '%s': %v", dir, err)
        }
    }
    // it didn't exist, so clone the repo
    a, err := ssh.NewPublicKeysFromFile("git", path.Join(os.Getenv("HOME"), ".ssh/id_rsa"), "")
    if err != nil {
        return fmt.Errorf("couldn't create auth: %v", err)
    }
    _, err = git.PlainClone(dir, false, &git.CloneOptions{
        Auth: a,
        URL:      repo,
        Progress: os.Stdout,
    })
    if err != nil {
        return fmt.Errorf("couldn't clone: %v", err)
    }
    return nil
}

func handler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    keys, ok := r.URL.Query()["uri"]
    if !ok || len(keys[0]) < 1 {
        log.Println("Url Param 'uri' is missing")
        return
    }
    uri := keys[0]
    keys, ok = r.URL.Query()["revision"]
    if !ok || len(keys[0]) < 1 {
        log.Println("Url Param 'revision' is missing")
        return
    }
    rev := keys[0]
    _, _ = fmt.Fprintf(w, "%s %s", uri, rev)
    // git@github.com:tanner-bruce/dever.git
    ps := strings.Split(uri, ":")
    root := strings.Split(ps[0], "@")
    if len(root) != 2 {
        log.Printf("bad root: %s", uri)
        return
    }
    base := root[1]
    rest := strings.Split(ps[1], ".git")[0]
    home := os.Getenv("HOME")
    p := path.Join(home, "src", base, rest)

    err := runGit(p, uri, rev)
    if err != nil {
        _, _ = fmt.Fprintf(w, "couldn't run git: %v", err)
    }
}

func checkout(path, rev string) error{
	cmd := exec.Command("git", "checkout", rev)
	cmd.Dir = path
	return cmd.Start()
}

func main() {
	log.Println("Starting dever server...")
    http.HandleFunc("/clone", handler)
    log.Fatal(http.ListenAndServe(":8735", nil))
}
