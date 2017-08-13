" Enable modern Vim features not compatible with Vi spec.
set nocompatible              " be iMproved, required

" Vundle Stuff
filetype off                  " required

" set the runtime path to include Vundle and initialize
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
" alternatively, pass a path where Vundle should install plugins
"call vundle#begin('~/some/path/here')

" let Vundle manage Vundle, required
Plugin 'VundleVim/Vundle.vim'

" airline
Plugin 'vim-airline/vim-airline'
Plugin 'vim-airline/vim-airline-themes'

" nerdtree
Plugin 'scrooloose/nerdtree'

" The following are examples of different formats supported.
" Keep Plugin commands between vundle#begin/end.

" All of your Plugins must be added before the following line
call vundle#end()            " required
filetype plugin indent on    " required
" To ignore plugin indent changes, instead use:
"filetype plugin on
"
" Brief help
" :PluginList          - list configured plugins
" :PluginInstall(!)    - install (update) plugins
" :PluginSearch(!) foo - search (or refresh cache first) for foo
" :PluginClean(!)      - confirm (or auto-approve) removal of unused plugins
"
" see :h vundle for more details or wiki for FAQ
" Put your non-Plugin stuff after this line

syntax on

" Folding stuff
set foldmethod=syntax
set nofoldenable

" Map Ctrl-Backspace to delete the previous word in insert mode.
imap <C-BS> <C-w>
noremap! <C-BS> <C-w>
noremap! <C-h> <C-w>

" Map Ctrl-Delete to delete the next word in insert mode
map <C-kDel> <C-O>dw

set backspace=indent,eol,start

" Colors
set t_Co=256

" Line numbering (relative and colors).
set number
set relativenumber
highlight LineNr ctermfg=Grey ctermbg=DarkGrey guifg=#2b506e guibg=#101010
highlight CursorLineNr ctermfg=Yellow ctermbg=DarkGrey

" Airline stuff
let g:airline#extensions#tabline#enabled = 1
let g:airline_theme='term'

" Clipboard stuff
set clipboard=unnamedplus
