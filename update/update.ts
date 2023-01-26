import { DynMarkdown, MarkdownTable, getJson } from 'dyn-markdown';
import type { RowContent } from 'dyn-markdown';

type ArticleLink = {
  name: string;
  link: string;
};

type Article = {
  index: string;
  category: string;
  article: string;
  motivation: string;
  date: string;
  tech: string[];
  links: ArticleLink[];
};

type Icon = {
  name: string;
  image: string;
  default_link: string;
};

/* -------------------------------------------------------------------------- */

const FIELDS = ['DEVELOPMENT_SETUP', 'DEVELOPMENT_CAREER', 'DEVELOPMENT_TIPS', 'TECHNOLOGIES_TUTORIALS', 'JAVASCRIPT_TUTORIALS', 'NODEJS_TUTORIALS', 'NODEJS_TEMPLATES', 'NODEJS_UTILITIES'];
const QNT_FIELDS = FIELDS.map((field) => `${field}_COUNT`);

const articlesMarkdown = new DynMarkdown('./README.md');
const articlesJson: Article[] = getJson('./update/articles.json');
const iconsJson: Icon[] = getJson('./update/icons.json');

updateQuantityFields(articlesMarkdown, articlesJson, QNT_FIELDS);
updateCategoriesTables(articlesMarkdown, articlesJson, iconsJson, FIELDS);
updateTocSections(articlesMarkdown, articlesJson);

articlesMarkdown.saveFile();

/* ========================================================================== */

function updateQuantityFields(articleMd: DynMarkdown, articlesJson: Article[], qty_fields: string[]) {
  let addedFields = 0;
  qty_fields.forEach((field) => {
    const curCategory = field.replace('_', ' ').replace('_COUNT', '');
    const articlesCount = articlesJson.filter((article: Article) => article.category === curCategory).length;
    const divider = addedFields === 0 ? '' : `  &nbsp;•&nbsp;\n`;
    const html_field = articlesCount === 0 ? '' : `<a href="#${curCategory.toLocaleLowerCase().replace(' ', '-')}">\n${divider}  ${getParsedCategory(curCategory.toLocaleLowerCase())} (${articlesCount})\n</a>`;
    if (articlesCount > 0) {
      addedFields += 1;
    }
    articleMd.updateField(field, html_field);
  });

  articleMd.updateField('ARTICLES_COUNT', `TUTORIALS (${getOnlyValidArticles(articlesJson).length}/${articlesJson.length})`);
}

function updateCategoriesTables(articleMd: DynMarkdown, articlesJson: Article[], iconsJson: Icon[], fields: string[]) {
  fields.forEach((field) => {
    const curCategory = field.replace('_', ' ');
    const articlesCount = articlesJson.filter((article: Article) => article.category === curCategory).length;

    let fieldContent = '';

    if (articlesCount) {
      const tableHtml = getCategoryTable(articlesJson, field.replace('_', ' '), iconsJson);
      const divHtml = articleMd.putContentInsideTag(`\n  ${tableHtml}\n`, 'div', { align: 'center' });
      const divider = `<div align="center"><a href="#"><img src=".github/images/divider.png"></a></div>`;
      fieldContent = `${divider}\n\n### ${field.replace('_', ' ')}<a href="#TOC"><img align="right" src=".github/images/up_arrow.png" width="22"></a>\n\n${divHtml}`;
    }

    articleMd.updateField(field, fieldContent);
  });
}

function updateTocSections(articleMd: DynMarkdown, articlesJson: Article[]) {
  articleMd.updateField('TOC_ARTICLES_BY_CATEGORY', getArticlesByCategory(articlesJson));
  articleMd.updateField('TOC_ARTICLES_BY_DATE', getArticlesByYear(articlesJson));
  articleMd.updateField('TOC_ARTICLES_BY_TECH', getArticlesByTech(articlesJson));
}

/* ========================================================================== */

function getOnlyValidArticles(articlesJson: Article[]) {
  const validArticlesArr = articlesJson.filter((article: Article) => article.date !== '').sort((a: Article, b: Article) => Number(new Date(b.date)) - Number(new Date(a.date)));
  return validArticlesArr;
}

function getArticlesByTech(articlesJson: Article[], onlyValid?: true) {
  const _articlesArr = onlyValid ? getOnlyValidArticles(articlesJson) : articlesJson;
  const techsArr = [...new Set(_articlesArr.map((article) => article.tech).flat(1))];
  techsArr.sort((a: string, b: string) => _articlesArr.filter((article) => article.tech.includes(b)).length - _articlesArr.filter((article) => article.tech.includes(a)).length);

  const articlesByTech = techsArr
    .map((tech: string) => {
      const techArticles = _articlesArr.filter((article) => article.tech.includes(tech));
      const initialRow = `  <li>\n    <p>${tech} (${techArticles.length})</p>\n    <ul>`;
      const finalRow = `\n    </ul>\n  </li>\n`;
      const htmlCategoryArticles = techArticles
        .map((article) => {
          const _article = article.links[0]?.link ? `<a href="#${article.index}">${article.article}</a>` : article.article;
          return `      <li>${_article}</li>`;
        })
        .join('\n');
      return `${initialRow}\n${htmlCategoryArticles}${finalRow}`;
    })
    .join('');

  return `<ul>\n` + articlesByTech + `</ul>`;
}
function getArticlesByCategory(articlesJson: Article[], onlyValid?: true) {
  const _articlesArr = onlyValid ? getOnlyValidArticles(articlesJson) : articlesJson;
  const categoriesArr = [...new Set(_articlesArr.map((article) => article.category))];

  const articlesByCategory = categoriesArr
    .map((category: string) => {
      const categoryArticles = _articlesArr.filter((article) => article.category === category);
      const initialRow = `  <li>\n    <a href="#${category.toLowerCase().replace(' ', '-')}">${category} (${categoryArticles.length})</a>\n    <ul>`;
      const finalRow = `\n    </ul>\n  </li>\n`;
      const htmlCategoryArticles = categoryArticles
        .map((article) => {
          const _article = article.links[0]?.link ? `<a href="#${article.index}">${article.article}</a>` : article.article;
          return `      <li>${_article}</li>`;
        })
        .join('\n');
      return `${initialRow}\n${htmlCategoryArticles}${finalRow}`;
    })
    .join('');

  return `<ul>\n` + articlesByCategory + `</ul>`;
}

function getArticlesByYear(articlesJson: Article[], onlyValid?: true) {
  const _articlesArr = onlyValid ? getOnlyValidArticles(articlesJson) : articlesJson;
  const yearsArr = [...new Set(_articlesArr.map((article) => (article.date === '' ? '' : new Date(article.date).getFullYear().toString())))];
  yearsArr.sort((a: string, b: string) => (a > b ? -1 : 1));

  const articlesByYear = yearsArr
    .map((year: string) => {
      const yearArticles = _articlesArr.filter((article) => {
        const cond1 = article.date === '' && year === '';
        const cond2 = article.date !== '' && new Date(article.date).getFullYear() === Number(year);
        return cond1 || cond2;
      });
      const initialRow = `  <li>\n    <p>${year || 'xxxx'} (${yearArticles.length})</p>\n    <ul>`;
      const finalRow = `\n    </ul>\n  </li>\n`;
      const htmlYearArticles = yearArticles
        .map((article) => {
          const _article = article.links[0]?.link ? `<a href="#${article.index}">${article.article}</a>` : article.article;
          return `      <li>${_article}</li>`;
        })
        .join('\n');
      return `${initialRow}\n${htmlYearArticles}${finalRow}`;
    })
    .join('');

  return `<ul>\n` + articlesByYear + `</ul>`;
}

function getParsedCategory(oldName: string): string {
  const newNames = {
    'technologies tutorials': 'technologies',
    'development career': 'dev career',
    'development tips': 'dev tips',
    'development setup': 'dev setup',
    'javascript tutorials': 'javascript',
    'nodejs tutorials': 'nodejs'
  };

  const newName = newNames[oldName as keyof typeof newNames];
  return newName ? newName : oldName;
}

function getCategoryTable(articlesJson: Article[], category: string, iconsJson: Icon[]) {
  const categoryArticlesArr = articlesJson.filter((article: Article) => article.category === category);

  const articlesTable = new MarkdownTable();

  articlesTable.setHeader([
    { content: 'date', width: 150 },
    { content: 'article', width: 500 },
    { content: 'motivation', width: 400 },
    { content: 'tech', width: 100 }
  ]);

  categoryArticlesArr
    .sort((a, b) => b.links.length - a.links.length)
    .forEach((item: Article) => {
      const { index, category, article, motivation, date, tech, links } = item;

      const techStr =
        tech.length === 0
          ? ''
          : tech
              .filter((ctech: string) => iconsJson.map((item: Icon) => item.name).includes(ctech))
              .map((ctech: string) => {
                const icon = iconsJson.find((icon: Icon) => icon.name === ctech);
                return `\n      <a target="_blank" href="${icon?.default_link}"><img src="${icon?.image}"></a>`;
              })
              .join('') + '\n    ';

      const articleFolder = date === '' ? article : `\n      <p><a name="${index}" href="https://github.com/lucasvtiradentes/my-tutorials/tree/master/tutorials/${encodeURI(index + ' - ' + article + '#TOC')}">${article}</a></p>`;
      const articleStr =
        links.length === 0
          ? articleFolder
          : `      ${articleFolder}` +
            links
              .filter((link: ArticleLink) => iconsJson.map((icon: Icon) => icon.name).includes(link.name))
              .map((link: ArticleLink) => {
                const icon = iconsJson.find((icon: Icon) => icon.name === link.name);
                return `\n      <a target="_blank" href="${link.link}"><img src="${icon?.image}" alt="${icon?.name}"></a>`;
              })
              .join('') +
            '\n    ';

      const bodyRow: RowContent[] = [
        { content: date || '-', align: 'center', width: 150 },
        { content: articleStr, align: 'center' },
        { content: motivation || '-', align: motivation ? 'left' : 'center' },
        { content: techStr || '-', align: 'center' }
      ];
      articlesTable.addBodyRow(bodyRow);
    });

  return articlesTable.getTable();
}
