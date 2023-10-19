package handlers

import (
	index "TIKify/web/home/templates"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"log"
	"math"
	"math/rand"
	"sort"
	"strconv"
)

func EmptyGraph() func(c *fiber.Ctx) (err error) {
	return GetHTML(index.Layout("Grafolog", "Graph", ""))
}

func GraphConfigIndex() func(c *fiber.Ctx) (err error) {
	return GetHTML(index.Layout("TIKify", "GraphConf", ""))
}

func GraphPostIndex() func(c *fiber.Ctx) (err error) {
	return func(c *fiber.Ctx) (err error) {
		fmt.Println(c.FormValue("num-nodes"))
		val, err := strconv.ParseInt(c.FormValue("num-nodes"), 10, 32)
		if err != nil {
			log.Fatal(err)
		}
		graph := GenRandGraph(int(val))
		var conn [][]string
		var nevim = []string{"Nodes"}
		for i := 0; i < int(val); i++ {
			nevim = append(nevim, fmt.Sprintf("Id: %d", i+1))
		}
		conn = append(conn, nevim)
		for id, row := range graph.Connections {
			var line = []string{fmt.Sprintf("Id: %d", id+1)}
			for _, val := range row {
				line = append(line, fmt.Sprintf("%d", val))
			}
			conn = append(conn, line)
		}
		g, err := json.Marshal(graph)
		if err != nil {
			log.Fatal(err)
		}
		c.Set("Content-Type", fiber.MIMETextHTML)

		var output bytes.Buffer

		err = index.Layout("Grafolog", "Graph", string(g)).Render(context.Background(), &output)
		if err != nil {
			return err
		}

		err = c.Send(output.Bytes())
		if err != nil {
			return err
		}

		return nil
	}
}

//func LoadGraphFromPB(c echo.Context) error {
//	return c.JSON(200)
//}

type Node struct {
	Id   int16   `json:"id,omitempty" :"id"`
	Name string  `json:"name,omitempty" :"name"`
	Relx float32 `json:"relx,omitempty" :"relx"`
	Rely float32 `json:"rely,omitempty" :"rely"`
	Note string  `json:"note,omitempty" :"note"`
}

type Graph struct {
	Name        string           `json:"name,omitempty" :"name"`
	Radius      int              `json:"radius,omitempty" :"radius"`
	Dragable    bool             `json:"dragable,omitempty" :"dragable"`
	Nodes       []map[string]any `json:"nodes,omitempty" :"nodes"`
	Connections [][]int          `json:"connections,omitempty" :"connections"`
}

func GenRandGraph(n int) Graph {
	var nodes = make([]map[string]any, n)
	var cords = make([][2]int, n)
	radius := 25
	var i int = 0
	for i < n {
		x, y := radius+rand.Intn(900), radius+rand.Intn(900)
		if testPosition(x, y, radius, cords) {
			cords[i][0] = x
			cords[i][1] = y
			i++
		}
	}
	sort.Slice(cords, func(i, j int) bool {
		return cords[i][0] < cords[j][0]
	})
	for ind := 0; ind < n; ind++ {
		nodes[ind] = make(map[string]any)
		nodes[ind]["id"] = int16(ind + 1)
		nodes[ind]["name"] = ""
		nodes[ind]["relx"] = float32(cords[ind][0]) / 950
		nodes[ind]["rely"] = float32(cords[ind][1]) / 950
		nodes[ind]["note"] = ""
	}

	var cons = make([][]int, n)
	for i := 0; i < n; i++ {
		var col = make([]int, n)
		for j := 0; j < n; j++ {
			x := rand.Float64()
			if math.Abs(float64(i-j)) <= 2 && x > 0.7 {
				col[j] = rand.Intn(50)
			}
		}
		cons[i] = col
	}
	return Graph{
		"",
		radius,
		true,
		nodes,
		cons,
	}
}

func testPosition(x int, y int, radius int, cords [][2]int) bool {
	dist := radius * 4
	for _, val := range cords {
		if x-dist < val[0] && y-dist < val[1] && x+dist > val[0] && y+dist > val[1] {
			return false
		}
	}
	return true
}
