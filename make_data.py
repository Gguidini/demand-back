import random

def key():
  letters = "ABCDEFGHIJKLMNOPQRSTUVWXYX"
  ans = ''
  for i in range(5):
    ans += random.choice(letters)
  return ans

def client():
  names = [
    'Frodo', 'Sam', 'Pipin', 'Merry', 'Gandalf',
    'Radagast', 'Saruman', 'Aragorn', 'Boromir', 'Legolas',
    'Gimly', 'Bilbo', 'Arwen', 'Elrond', 'Eomer',
    'Theoden', 'Faramir', 'Barbarvore', 'Rosinha', 'Golum'
  ]
  return random.choice(names)

def item():
  items = [
    'Lembas', 'Batata Frita', 'Milk Shake', 'Big Mac',
    'Whooper', 'Ceasar Salad', 'Capuccino', 'Lasagna', 'Sorvete',
    'Cha gelado', 'Laranja', 'Chocolate Quente', 'Esfirra',
    'Cachorro Quente', 'Pastel'
  ]
  return random.choice(items)

def date():
  #2019-07-08 09:30:26
  year = str(random.randint(2010, 2019))
  month = str(random.randint(1, 12))
  day = str(random.randint(1, 28))
  hour = str(random.randint(0, 23))
  minute = str(random.randint(0, 59))
  second = str(random.randint(0, 59))
  return "{}-{}-{} {}:{}:{}".format(year, month, day, hour, minute, second)

with open('./mock.json', 'w') as fd:
  fd.write("{\n  \"size\":500,\n  \"transactions\": [\n")
  for i in range(500):
    obj = (key(), item(), date(), client())
    fd.write("    {\n")
    fd.write("      \"key\": \"{}\",\n".format(obj[0]))
    fd.write("      \"item\": \"{}\",\n".format(obj[1]))
    fd.write("      \"date\": \"{}\",\n".format(obj[2]))
    fd.write("      \"client\": \"{}\",\n".format(obj[3]))
    fd.write("      \"description\": \"blah blah blah blah blah blah\"\n")
    if i < 499:
      fd.write("    },\n")
    else:
      fd.write("    }\n")
  fd.write("  ]\n}\n")



