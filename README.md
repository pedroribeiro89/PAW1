# Padrões WEB - HTML, CSS, JAVASCRIPT
## Atividade 1

Usando apenas a HTML e a CSS, construa uma página Web que represente um filme de cinema (qualquer um, à sua preferência). Use algum site de cinema (ex.:adorocinema.com) para obter as informações necessárias.

As informações que sua página deve conter são:

- Título do filme em português
- Título original do filme  (lembre-se do atributo de idioma)
- Ano de produção
- País(es) de origem
- Gênero(s)
- Recomendação de idade
- Diretor(es)
- Elenco (principais atores e papeis; mínimo de 3)
- Poster
- Imagens (mínimo de 3)
- Trailer (incorporado à página)
- Sinopse
- Os requisitos tecnológicos são:

usar apenas HTML e CSS
os códigos devem ser válidos (use o HTML5 Validator e o CSS Validator)
Em seguida, usando a JavaScript, você deve ajustar a sua página para permitir a visualização ampliada de imagens do filme, a partir das suas versões reduzidas (thumbnails), da mesma forma que as lojas virtuais usam
Ao clicarmos nas imagens pequenas (thumbnails), a imagem grande deve ser alterada e a imagem pequena deve receber algum destaque ou realce. Essa operação deve ocorrer necessariamente por meio de uma função JavaScript.

Foi feito uma pagina do filme Era uma vez em hollywood. com dados do adorocinema.com e imdb.com 

## Atividade 2
Usando jQuery e Bootstrap, construa uma página interativa que contenha um extrato bancário. Use uma tabela para representar esse extrato. Para cada linha da tabela, deve haver uma data, um código de lançamento, uma descrição do lançamento, o valor do lançamento e o saldo da conta, como mostrado abaixo:

Os requisitos para este projetos são:

- A tabela deve ser formatada com Bootstrap e os  valores negativos devem aparecer em vermelho, enquanto os valores positivos devem aparecer em preto.
- Deve ser possível ordenar a tabela por data (1ª coluna) e por código (2ª coluna).
- Deve haver um formulário para que o usuário cadastre novos lançamentos. Os campos desse formulário devem ser controlados ou validados para que o usuário não informe valores incompatíveis com o campo.
- Todos os lançamentos devem ser armazenados localmente, por meio da API Local Storage. Assim, tanto a construção inicial da tabela quanto o registro de novos lançamentos deve ser feita por meio dos dados armazenados localmente.
- Deve ser possível alterar os campos descrição e valor de um lançamento qualquer.
- Deve ser possível excluir um lançamento qualquer.

Foi feito um arquivo js extra com a implementacao de um quicksort para ser utilizado na ordenacao da tabela, com a motivação de treinar IIFE(Immediately-invoked function expression)

## Atividade 3
Agora você deve projetar um site seu, que contenha pelo menos três páginas diferentes. O tema do site é livre e ele será avaliado de acordo com os seguintes critérios:

- Correção semântica dos elementos HTML (escolha dos elementos apropriados);
- Correção sintática dos códigos HTML, CSS e JavaScript (feita por meio dos validadores);
- Separação de conteúdo, comportamento e formatação;
- Layout responsivo (usando ou não a biblioteca Bootstrap);
- Possibilidade de interação com o conteúdo (usando ou não a biblioteca jQuery);
- Existência de um formulário para entrada de dados, com validação de campos;
- Armazenamento local de dados, por meio da API Local Storage.