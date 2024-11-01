from invoke import task


def print_task(task_name: str):
    separator = "-------------------------"
    print("\n".join([separator, task_name, separator]))


@task
def format(c):
    print_task("Ruff")
    c.run("ruff check . --fix")
    print_task("Black")
    c.run("black .")


@task
def lint(c):
    print_task("MyPy")
    c.run("mypy .")


@task
def build(c):
    c.run("uvicorn vessel_connections.main:app --port 8000 --reload")


@task
def test(c, path="."):
    print_task("Formatter checks")
    c.run("ruff check")
    c.run("black --check .")
    print_task("Linting")
    c.run("mypy .")
    print_task("Backend tests")
    c.run(f"pytest {path} --cov --junitxml=.test-output/test-results.xml --cov-report term-missing")
