import os

def openFile(f):
  f = open(f, 'r')
  body = f.read()
  f.close()
  return body

def writeFile(f, body):
  f = open(f, 'w')
  f.write(body)
  f.close()

def replaceHTTP():

  def rp(body):
    return body.replace('- http:', '- https:')

  dir = '../source/_posts'
  for x, y, z in os.walk(dir):
    for md in z:
      if '.md' in md:
        md_path = os.path.join(dir, md)
        writeFile(md_path, rp(openFile(md_path)))

def main():
  replaceHTTP()

if __name__ == '__main__':
  main()