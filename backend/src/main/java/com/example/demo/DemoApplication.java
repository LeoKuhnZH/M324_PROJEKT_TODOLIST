package com.example.demo;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * This is a demo application that provides a RESTful API for a simple ToDo list
 * without persistence.
 * The endpoint "/" returns a list of tasks.
 * The endpoint "/tasks" adds a new unique task.
 * The endpoint "/delete" suppresses a task from the list.
 * The task description transferred from the (React) client is provided as a
 * request body in a JSON structure.
 * The data is converted to a task object using Jackson and added to the list of
 * tasks.
 * All endpoints are annotated with @CrossOrigin to enable cross-origin
 * requests.
 *
 * @author luh
 */
@RestController
@SpringBootApplication
public class DemoApplication {

    private List<Task> tasks = new ArrayList<>();

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @CrossOrigin
    @GetMapping("/v1/")
    public List<Task> getTasksV1() {

        System.out.println("API EP '/' returns task-list of size " + tasks.size() + ".");
        if (tasks.size() > 0) {
            int i = 1;
            for (Task task : tasks) {
                System.out.println("-task " + (i++) + ":" + task.getTaskdescription());
            }
        }
        return tasks; // actual task list (internally converted to a JSON stream)
    }

    @CrossOrigin
    @GetMapping("/")
    public List<Task> getTasks() {
        return getTasksV1();
    }

    @CrossOrigin
    @PostMapping("/v1/tasks")
    public String addTaskV1(@RequestBody String taskdescription) {
        System.out.println("API EP '/tasks': '" + taskdescription + "'");
        ObjectMapper mapper = new ObjectMapper();
        try {
            Task task;
            task = mapper.readValue(taskdescription, Task.class);
            for (Task t : tasks) {
                if (t.getTaskdescription().equals(task.getTaskdescription())) {
                    System.out.println(">>>task: '" + task.getTaskdescription() + "' already exists!");
                    return "redirect:/"; // duplicates will be ignored
                }
            }
            System.out.println("...adding task: '" + task.getTaskdescription() + "'");
            tasks.add(task);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return "redirect:/";
    }

    @CrossOrigin
    @PostMapping("/tasks")
    public String addTask(@RequestBody String taskdescription) {
        return addTaskV1(taskdescription);
    }

    @CrossOrigin
    @PostMapping("/v1/delete")
    public String delTaskV1(@RequestBody String taskdescription) {
        System.out.println("API EP '/delete': '" + taskdescription + "'");
        ObjectMapper mapper = new ObjectMapper();
        try {
            Task task;
            task = mapper.readValue(taskdescription, Task.class);
            Iterator<Task> it = tasks.iterator();
            while (it.hasNext()) {
                Task t = it.next();
                if (t.getTaskdescription().equals(task.getTaskdescription())) {
                    System.out.println("...deleting task: '" + task.getTaskdescription() + "'");
                    it.remove();
                    return "redirect:/";
                }
            }
            System.out.println(">>>task: '" + task.getTaskdescription() + "' not found!");
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return "redirect:/";
    }

    @CrossOrigin
    @PostMapping("/delete")
    public String delTask(@RequestBody String taskdescription) {
        return delTaskV1(taskdescription);
    }

}
