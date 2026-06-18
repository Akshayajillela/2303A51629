const fs = require("fs");

const data = JSON.parse(fs.readFileSync("vehicles.json", "utf8"));
const tasks = data.vehicles;

const depots = [
  { ID: 1, MechanicHours: 60 },
  { ID: 2, MechanicHours: 135 },
  { ID: 3, MechanicHours: 188 },
  { ID: 4, MechanicHours: 97 },
  { ID: 5, MechanicHours: 164 }
];

function knapsack(tasks, capacity) {
  const n = tasks.length;

  const dp = Array(n + 1)
    .fill()
    .map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const duration = tasks[i - 1].Duration;
    const impact = tasks[i - 1].Impact;

    for (let w = 0; w <= capacity; w++) {
      if (duration <= w) {
        dp[i][w] = Math.max(
          impact + dp[i - 1][w - duration],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  let w = capacity;
  const selectedTasks = [];

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedTasks.push(tasks[i - 1]);
      w -= tasks[i - 1].Duration;
    }
  }

  return {
    maxImpact: dp[n][capacity],
    selectedTasks
  };
}

const results = [];

depots.forEach((depot) => {
  const result = knapsack(tasks, depot.MechanicHours);

  results.push({
    depotId: depot.ID,
    mechanicHours: depot.MechanicHours,
    maxImpact: result.maxImpact,
    tasksSelected: result.selectedTasks.length
  });
});

fs.writeFileSync(
  "results.json",
  JSON.stringify(results, null, 2)
);

console.log("results.json generated successfully");