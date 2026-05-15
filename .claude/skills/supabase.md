# Supabase Architecture Skill

Always use secure scalable Supabase architecture.

Authentication:

* Supabase Auth
* Persistent sessions
* Protected routes
* Middleware authentication guards
* Proper logout handling

Database Standards:

* Use Row Level Security (RLS)
* Users can only access their own data
* Proper foreign key relationships
* Indexed important fields
* Timestamps for all records

Query Standards:

* Type-safe queries
* Reusable database functions
* Proper error handling
* Optimistic UI updates when useful

Security:

* Never expose service role keys
* Use public anon keys safely
* Validate user ownership before updates/deletes

Tables:

* users
* customers
* reminders
* activities
* message_templates

Application Rules:

* All customer actions should create activity logs
* Dashboard should fetch live stats
* Follow-ups should support overdue tracking

Always prioritize security, scalability, and clean database architecture.
