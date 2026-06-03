package com.example.demo;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

public class DemoApplicationTests {

	private List<String> tasks = new ArrayList<>();
	private ObjectMapper mapper = new ObjectMapper();

	public List<String> getTasks() {
		return tasks;
	}

	// ➜ TASK HINZUFÜGEN
	public void addTask(String json) {
		try {
			JsonNode node = mapper.readTree(json);
			String desc = node.get("taskdescription").asText();


			if (desc == null || desc.trim().isEmpty()) {
				return;
			}


			for (String t : tasks) {
				if (t.equals(desc)) {
					return;
				}
			}

			tasks.add(desc);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	// ➜ TASK LÖSCHEN
	public void delTask(String json) {
		try {
			JsonNode node = mapper.readTree(json);
			String desc = node.get("taskdescription").asText();

			Iterator<String> it = tasks.iterator();
			while (it.hasNext()) {
				if (it.next().equals(desc)) {
					it.remove();
					return;
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}