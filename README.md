# HW3

### Screencast of the Redis Demo
http://youtu.be/YuXC8H44TX0?hd=1

### Conceptual Questions

#### Describe some benefits and issues related to using Feature Flags.

Pros:
Feature flags are mainly used in case of dark launches. It decouples deployment from releasing features through Canary releases thereby eliminating risk.
It removes the need to maintain long lived branches and also solves merge issues

Cons:
They are a form of technical debt because of branching. Hard to maintain.
Running multiple versions of the same code with one version released to the customer is complex.
Users might use a feature in a different way than what is expected.

#### What are some reasons for keeping servers in seperate availability zones?

To store data redundantly in case there is a loss of information (a form of backup). This help in case the server of a zone fails.
In case they are in seperate availability zones, the data will still be available in case one zone is affected by a natural calamity.
Also, the user accessing the data can be seamlessly routed to a secondary zone in case the traffic is high, thus maintaining the speed.

#### Describe the Circuit Breaker pattern and its relation to operation toggles.

Operation toggles is a form of a circuit breaker. In this case, a protected function call is wrapped within the circuit breaker object which monitors for failures. A threshold is set for the failures. Once the threshold is met, all further calls to that protected function returns an error thereby avoiding cascading failures. 

#### What are some ways you can help speed up an application that has

#### a) traffic that peaks on Monday evenings
As described above many availability zones can be maintained so that users can be routed to a different zone when the traffic is high towards one zone. Which means maintaining many availability zones will solve this issue

#### b) real time and concurrent connections with peers
Queueing requests and reducing the number of parallel connections is an optimal way to solve this issue.

#### c) heavy upload traffic
Distributing traffic over many instances and scheduling the traffic will help resolve this issue.
